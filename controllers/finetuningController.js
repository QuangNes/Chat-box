const fs = require('fs')
const path = require('path')
const { initMessages, openai, getModelId } = require("../configs/openai")

const getInitMessages = (_, res) => {
    res.status(200).json(initMessages)
}

const reply = async (req, res) => {
    const completion = await openai.chat.completions.create({
        messages: req.body,
        model: getModelId()
    });

    res.status(200).json({content: completion.choices[0].message.content, role:'assistant'})
}

const saveFeedback = (req, res) => {
    fs.writeFileSync(path.join(__dirname, '../data/feedbacks.jsonl'), JSON.stringify(req.body) + "\n", {flag:"a"})
    res.status(200)
}

module.exports = {
    getInitMessages,
    reply,
    saveFeedback
}