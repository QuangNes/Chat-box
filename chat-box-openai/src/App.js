import './App.css';
import {React, useEffect, useRef, useState} from 'react'
import OpenAI from 'openai'


function App() {
  const [showChatBox, setShowChatBox] = useState('')
  const [message, setMesage] = useState('')
  const [messages, setMessages] = useState([{
    content: "Hello, how can I help you today",
    role: "system"
  }])

  const messagesEndRef = useRef(null)
  
  const openai = new OpenAI({apiKey:"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", dangerouslyAllowBrowser:'yes', });

  const toggleChatBox = (e) => {
    if (showChatBox.length === 0) setShowChatBox('show-chatbot');
    else setShowChatBox('')
  }

  const handleChatKeyDown = (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800) {
      e.preventDefault();
      sendMessage();
    }
  }

  const sendMessage = async (e) => {
    console.log(`Sended message: ${message}`);

    setMessages(prev => [...prev, {content: message, role: 'user'}])
    setMessages(prev => [...prev, {content: "Thinking ...", role: 'system'}])

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices);

    setMesage('');
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

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
              if (message.role === 'system') 
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
