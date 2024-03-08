import ChatBox from '../components/ChatBox';
import '../App.css';
import {React} from 'react'



function Home() {
  
  return (
    <div className='app'>
      
      <div class="two alt-two">
        <h1>Tư Vấn Tâm Lý<br></br>
          <span>Hỗ Trợ Bạn Trên Mọi Hành Trình</span>
        </h1>
      </div>
      
      <ChatBox></ChatBox>
      
    </div>
  );
}

export default Home;