const {OpenAI} = require('openai')
require('dotenv').config()

const initMessages = {
    messages: [
        {
          role: "system",
          content: "You are a psychologist"
        },
        {
          content: "Xin chào, tôi là PsyBot, tôi có thể giúp gì cho bạn!",
          role: "assistant"
        }
    ]
}

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

module.exports = {
    initMessages,
    openai
}