const {OpenAI} = require('openai')
const fs = require("fs");
const path = require('path');
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

const getModelId = () => {
  return fs.readFileSync(path.join(__dirname, 'fine_tuning_model.txt'), "utf8");
}

const updateModelId = (model_id) => {
  fs.writeFileSync(path.join(__dirname, 'fine_tuning_model.txt'), model_id)
}

module.exports = {
    initMessages,
    openai,
    getModelId,
    updateModelId
}