const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 8080

app.use(cors())

app.use(express.json()); //allow to send json
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!')
})

app.post('/feedback', (req, res) => {
    console.log(req.body);
    fs.writeFileSync('./data/feedbacks.jsonl', JSON.stringify(req.body) + "\n", {flag:"a"})
    res.status(200)
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})