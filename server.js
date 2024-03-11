const express = require('express')
const cors = require('cors')
const {addAsync} = require('@awaitjs/express')
const { retrain } = require('./data/retrain')
const botList = require('./configs/botList')

const app = addAsync(express())
const port = 8080

app.use(cors())

app.use(express.json()); //allow to send json
app.use(express.urlencoded({ extended: false }));

app.get('/', (_, res) => {
    res.status(200).json(botList);
})

app.use("/psybot", require("./routes/finetuningRoute"));
app.use("/psychobot", require("./routes/embedingRoute"));
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const retrainInterval = setInterval(() => {
    retrain()
}, 24 * 60 * 60 * 1000);//check evveryday