const fs = require('fs')
const path = require('path')
const { getInitMessages: initMessages, openai, getFineTuningModelName } = require("../utils/openai")
const botList = require('../configs/botList')

const getInitMessages = (_, res) => {
    res.status(200).json(initMessages(botList[0]))
}

const reply = async (req, res) => {
    const completion = await openai.chat.completions.create({
        messages: req.body,
        model: getFineTuningModelName()
    });

    res.status(200).json({content: completion.choices[0].message.content, role:'assistant'})
}

const saveFeedback = (req, res) => {
    fs.writeFile(path.join(__dirname, '../data/feedbacks.jsonl'), JSON.stringify(req.body) + "\n", {flag:"a"}, (err) => {console.log(err);})
    res.status(200);
}

module.exports = {
    getInitMessages,
    reply,
    saveFeedback
}