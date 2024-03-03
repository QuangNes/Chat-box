const fs = require('fs')

const saveFeedback = (req, res) => {
    fs.writeFileSync('./data/feedbacks.jsonl', JSON.stringify(req.body) + "\n", {flag:"a"})
    res.status(200)
}

module.exports = {
    saveFeedback
}