import './App.css';
import {React, useEffect, useRef, useState} from 'react'
import OpenAI from 'openai'


function App() {
  const [status, setStatus] = useState(false)
  const [showChatBox, setShowChatBox] = useState('')
  const [message, setMesage] = useState('')
  const [messages, setMessages] = useState([{
    content: "Hello, how can I help you today",
    role: "assistant"
  }])

  const messagesEndRef = useRef(null)
  
  const openai = new OpenAI({apiKey:"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", dangerouslyAllowBrowser:'yes', });

  const toggleChatBox = (e) => {
    if (showChatBox.length === 0) setShowChatBox('show-chatbot');
    else setShowChatBox('')
  }

  const handleChatKeyDown = (e) => {
    console.log(e.key);
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const sendMessage = (e) => {
    const myMessage = message
    setMesage("")
    console.log(`Sended message: ${myMessage}`);

    setMessages(prev => [...prev, {content: myMessage, role: 'user'}])
    // setMessages(prev => [...prev, {content: "Thinking ...", role: 'assistant'}])

    setStatus(true)

    // setMessages(prev => [...prev, {content: completion.choices[0].message.content, role:'assistant'}]);
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateResponse = async () => {
    if (status === true) {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo-0613",
      });
      setMessages(prev => [...prev, {content: completion.choices[0].message.content, role:'assistant'}]);
    }
    if (status === true) setStatus(false)
  }

  useEffect(() => {
    generateResponse()
  }, [status]);

  useEffect(() => {
    scrollToBottom()
  }, [message])

  return (
    <div className={showChatBox}>
      <button className='chatbot-toggler' onClick={toggleChatBox}>
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        
        <ul className="chatbox">
          {
            messages.map((message, index) => {
              if (message.role === 'assistant') 
              {
                return (
                  <li className='chat incoming' key={index}>
                    <span className="material-symbols-outlined">logo_dev</span>
                    <p>{message.content}</p>
                  </li>
                )
              }
              else 
              {
                return (
                  <li className='chat outgoing' key={index}>
                    <p>{message.content}</p>
                  </li>
                )
              }
            })
          }
          <div ref={messagesEndRef}></div>
        </ul>

        <div className="chat-input">
          <textarea value={message} onChange={(e) => setMesage(e.currentTarget.value)} onKeyDown={handleChatKeyDown} placeholder="Enter a message..." required></textarea>
          <span id ="send-btn" className="material-symbols-outlined" onClick={sendMessage}>send</span>
        </div>
      </div>
    </div>
  );
}

export default App;
