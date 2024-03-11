import ChatBox from '../components/ChatBox';
import '../App.css';
import {React, useEffect, useState} from 'react'
import OpenChatDialog from '../components/OpenChatDialog';
import axios from 'axios';
import { API_URL } from '../configs/url';

function Home() {
  const [botList, setBotList] = useState([])
  const [bot, setBot] = useState("")
  const [selectType, setSelectType] = useState(false)

  const handleChatClick = () => {
    setSelectType(true)
  }

  const handleSelectType = (value) => {
    setSelectType(false)
    setBot(value)
  }

  const getBotList = async () => {
    const res = await axios.get(API_URL);
    setBotList(res.data)
  }

  useEffect(() => {
    getBotList();
  }, [])
  
  return (
    <div className='app'>
      
      <div class="two alt-two">
        <h1>Tư Vấn Tâm Lý<br></br>
          <span>Hỗ Trợ Bạn Trên Mọi Hành Trình</span>
        </h1>
      </div>

      <OpenChatDialog
        open={selectType}
        selectedValue={bot}
        onClose={handleSelectType}
        botList={botList}
      />
      
      {bot.length === 0 && <button className='chatbot-toggler' onClick={handleChatClick}>
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>}
      {bot.length !== 0 && <ChatBox bot={bot}></ChatBox>}
      
    </div>
  );
}

export default Home;