import { useState, useRef, useEffect } from 'react';
import AtomicSpinner from 'atomic-spinner'
import Rating from '@mui/material/Rating'
import {Unstable_Popup as BasePopup} from '@mui/base/Unstable_Popup'
import { styled } from '@mui/system';
import axios from 'axios'

export default function ChatBox() {
  const API_URL = "http://localhost:8080"

  const [status, setStatus] = useState(false)
  const [showChatBox, setShowChatBox] = useState('')
  const [message, setMesage] = useState('')
  const [messages, setMessages] = useState([])
  const [anchor, setAnchor] = useState(null)

  const messagesEndRef = useRef(null)

  const toggleChatBox = (e) => {
    if (showChatBox.length === 0) setShowChatBox('show-chatbot');
    else setShowChatBox('')
  }

  const handleChatKeyDown = (e) => {
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

  const handleRatingChange = (e, rating) => {
    setAnchor(anchor ? null : e.currentTarget)
    setTimeout(() => {
      setAnchor(null)
    }, 1000);

    // // In this flow, we need to send rating to server and server will automaticaly re training the bot 
    // // But as this web is just a demo with FE only, I will save it to a file then 
    const feedback = {
      rating,
      messages
    }

    axios.post(API_URL + '/feedback', feedback)
    console.log(feedback);
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateResponse = async () => {
    if (status === true) {
      const res = await axios.post(API_URL + "/message", messages);

      setMessages(prev => [...prev, res.data]);
    }
    if (status === true) setStatus(false)
  }

  const getInitMessages = async () => {
    const res = await axios.get(API_URL + "/message")
    setMessages(res.data.messages)
  }

  useEffect(() => {
    generateResponse()
  }, [status]);

  useEffect(() => {
    scrollToBottom()
  }, [message])

  useEffect(() => {
    getInitMessages()
  }, [])

  return (
      <div className={`${showChatBox}`}>
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
                      <>
                      <li className='chat incoming' key={index}>
                          <span className="material-symbols-outlined">logo_dev</span>
                          <p>{message.content}</p>
                      </li>
                      {index === messages.length - 1 && index !== 1 && <Rating className='rating' onChange={handleRatingChange}></Rating>}
                      </>
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

          <BasePopup  open={anchor ? 'simple-popper' : undefined} anchor={anchor}>
              <PopupBody>Thanks for rating us</PopupBody>
          </BasePopup>
      </div>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  z-index: 1;
`,
);