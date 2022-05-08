const express = require("express")
const app = express()
require('dotenv').config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.get('/api', (req, res) => {
    const apiKey = req.query.apiKey
    // TODO - validate apiKey
    // TODO - bill user for usage
    res.send({data: "Hello World"})

})


// Create a Stripe checkout session to create a Customer and subscription
app.post("/checkout", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
            price: process.env.PRICE_ID,
        }],
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cancel',
    })
    res.send(session)
})


// Listen to webhooks from Stripe when important events happen
app.post('/webhook', async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    switch (eventType) {
      case 'checkout.session.completed':
        console.log(data)
        break;
      case 'invoice.paid':
        break;
      case 'invoice.payment_failed':
        break;
      default:
      // Unhandled event type
    }
  
    res.sendStatus(200);
  });

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000")
})