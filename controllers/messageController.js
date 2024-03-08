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

module.exports = {
    getInitMessages,
    reply
}