const express = require('express')
const cors = require('cors')
const {addAsync} = require('@awaitjs/express')

const app = addAsync(express())
const port = 8080

app.use(cors())

app.use(express.json()); //allow to send json
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
})

app.use("/feedback", require("./routes/feedbackRoute"));
app.use("/message", require("./routes/messageRoute"));
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})