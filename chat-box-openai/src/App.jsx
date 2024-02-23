import './App.css';
import {React, useEffect, useRef, useState} from 'react'
import OpenAI from 'openai'
import AtomicSpinner from 'atomic-spinner'


function App() {
  const [status, setStatus] = useState(false)
  const [showChatBox, setShowChatBox] = useState('')
  const [message, setMesage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are a psychologist"
    },
    {
      content: "Xin chào, đừng ngại nói với chúng tôi nếu bạn có gặp vấn đề gì nhé!",
      role: "assistant"
    }
  ])

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
      sendMessage(e);
    }
  }

  const sendMessage = (e) => {
    console.log(`Sended message: ${message}`);

    setMessages(prev => [...prev, {content: message, role: 'user'}])

    setMesage("")
    setStatus(true)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateResponse = async () => {
    if (status === true) {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "ft:gpt-3.5-turbo-0613:personal::8v3ZLLUx",
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
    <div className={`app ${showChatBox}`}>
      <div className='title'>
        <div className='text-title'>Tư Vấn Tâm Lý: Hỗ Trợ Bạn Trên Mọi Hành Trình</div>
      </div>

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
              else if (message.role === "user")
              {
                return (
                  <li className='chat outgoing' key={index}>
                    <p>{message.content}</p>
                  </li>
                )
              }
            })
          }
          { status && <li className='chat incoming'>
            <span className="material-symbols-outlined">logo_dev</span>
            <AtomicSpinner atomSize={30}/>
          </li>}
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
