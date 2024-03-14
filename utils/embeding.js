const path = require('path')
const {ConversationalRetrievalQAChain} = require('langchain/chains')
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DirectoryLoader, UnknownHandling } = require("langchain/document_loaders/fs/directory");
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { openAIEmbeding, chatOpenAI } = require('./openai');

const VECTORSTORE_PATH = path.join(__dirname, '../data/VectorStore');

let chain = null;

const loadDocuments = async () => {
    const directoryLoader = new DirectoryLoader(
        path.join(__dirname, '../data'),
        {
            ".pdf": (path) => {
                console.log("Loaded", path);
                return new PDFLoader(path)
            },
        },
        false,
        UnknownHandling.Ignore
    );

    let docs = null;
    try {
        docs = await directoryLoader.loadAndSplit(
            new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200
            })
        );
    }
    catch (err) {
        console.log(err);
    }

    console.log("Document loaded!!!");
    return docs;
}

const loadVectorStores = async (reload = false) => {
    let vectorStore = null;
    if (reload) {
        const docs = await loadDocuments()
    
        console.log('Loading vectorstore from embeding documents');
        vectorStore = await FaissStore.fromDocuments(
            docs,
            openAIEmbeding
        );
        //need to check and save it here
        vectorStore.save(VECTORSTORE_PATH);
    }
    else {
        console.log('Loading vectorstore from local');
        try {
            vectorStore = await FaissStore.load(
                VECTORSTORE_PATH,
                openAIEmbeding
            );
        }
        catch (err) {
            console.log("Can not load vectorstore from local. Try loading it from embeding documents");
            return await loadVectorStores(true)
        }
    }

    console.log("VectorStore loaded!!!");
    return vectorStore;
}

const getChain = async () => {
    const vectorStore = await loadVectorStores();
    if (!chain) {
        chain = ConversationalRetrievalQAChain.fromLLM(
            chatOpenAI,
            vectorStore.asRetriever()
        )
    }

    console.log("ConversationalRetrievalQAChain loaded!!!");
    return chain;
}

const generateChatHistory = (messages) => {
    let chatHistory = ""
    for (let i = 1; i < messages.length - 1; ++i)
        chatHistory += "\n" + messages[i].content;
    return chatHistory;
}

module.exports = {
    getChain,
    generateChatHistory
}
