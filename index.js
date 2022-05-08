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


app.listen(3000, () => {
    console.log("Server started on http://localhost:3000")
})