const {OpenAI} = require('openai')
const fs = require("fs");
const path = require('path');
const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
require('dotenv').config()

const FINE_TUNING__MODEL_PATH = path.join(__dirname, '../configs/fine_tuning_model.txt');

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const openAIEmbeding = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-large"
})

const getInitMessages = (bot) => {
  return {
    messages: [
        {
          role: "system",
          content: `${bot.name}: ${bot.description}`
        },
        {
          content: `Xin chào, tôi là ${bot.name}, tôi có thể giúp gì cho bạn!`,
          role: "assistant"
        }
    ]
  }
}

const getFineTuningModelName = () => {
  return fs.readFileSync(FINE_TUNING__MODEL_PATH, "utf8");
}

const updateFineTuningModelName = (model_id) => {
  fs.writeFile(FINE_TUNING__MODEL_PATH, model_id);
}

const chatOpenAI = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: getFineTuningModelName()
})

module.exports = {
    openai,
    openAIEmbeding,
    chatOpenAI,
    getInitMessages,
    getFineTuningModelName,
    updateFineTuningModelName,
}