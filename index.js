const express = require("express")
const app = express()

app.get('/api', (req, res) => {
    const apiKey = req.query.apiKey
    // TODO - validate apiKey
    // TODO - bill user for usage
    res.send({data: "Hello World"})

})

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000")
})