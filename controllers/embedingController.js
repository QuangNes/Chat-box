const fs = require('fs')
const path = require('path')
const { getInitMessages: initMessages } = require("../utils/openai")
const botList = require('../configs/botList')
const { getChain, generateChatHistory } = require('../utils/embeding')

const getInitMessages = (_, res) => {
    res.status(200).json(initMessages(botList[1]))
}

const reply = async (req, res) => {
    const question = req.body[req.body.length - 1].content;
    const chat_history = generateChatHistory(req.body);
    const chain = await getChain();
    const reply = await chain.invoke({question, chat_history})
    res.status(200).json({content: reply.text, role:'assistant'})
}

const saveFeedback = (req, res) => {
    fs.writeFileSync(path.join(__dirname, '../data/embed_feedbacks.jsonl'), JSON.stringify(req.body) + "\n", {flag:"a"})
    res.status(200)
}

module.exports = {
    getInitMessages,
    reply,
    saveFeedback
}