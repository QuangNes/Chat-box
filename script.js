const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message,classname) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",classname);
    let chatContent = classname === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">logo_dev</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log(userMessage)
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    // Append the user`s message to chat box
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight); // Lam` truc lang coi 26.52

    setTimeout(() => {
        chatbox.appendChild(createChatLi("Think....","incoming"));
        chatbox.scrollTo(0,chatbox.scrollHeight);
        // Code call ChatAI here
        //Video: https://www.youtube.com/watch?v=Bv8FORu-ACA&t=987s 21p09
    },600)
}

chatInput.addEventListener("input",() =>{
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown",(e) =>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));