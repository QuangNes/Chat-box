const { initMessages, openai } = require("../configs/openai")

const getInitMessages = (_, res) => {
    res.status(200).json(initMessages)
}

const reply = async (req, res) => {
    const completion = await openai.chat.completions.create({
        messages: req.body,
        model: process.env.MODEL_ID,
    });

    res.status(200).json({content: completion.choices[0].message.content, role:'assistant'})
}

module.exports = {
    getInitMessages,
    reply
}