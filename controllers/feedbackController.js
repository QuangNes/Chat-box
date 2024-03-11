const fs = require('fs')
const path = require('path')

const saveFeedback = (req, res) => {
    fs.writeFileSync(path.join(__dirname, '../data/feedbacks.jsonl'), JSON.stringify(req.body) + "\n", {flag:"a"})
    res.status(200)
}

module.exports = {
    saveFeedback
}