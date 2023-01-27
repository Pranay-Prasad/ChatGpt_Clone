import './App.css';
import './normal.css'
import ultron from './Images/ultron.png'
import mrbean from './Images/mrbean.png'
import {useState,useEffect} from 'react';
function App() {

  useEffect(() => {
    getEngines();
  }, [])
  
  const [input,setinput] = useState("");
  const [Models,setModels] = useState([]);
  const [chatLog,setchatLog] = useState([
    {user: "me",message:"Hey there"},
    {user: "gpt",message:"Hello, How can i help you?"},
    {user: "me",message:"What is react js?"},
    {user: "gpt",message:"React is an open-source JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies."}
  ]);
  const [currentmodel,setcurrentmodel] = useState("ada");

  function onClear(){
    setchatLog([]);
  }

  function getEngines(){
    fetch("http://localhost:5000/models")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setModels(data.models)
    })
  }


  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog,{user: "me",message: `${input}`}];
    // setchatLog([...chatLog,{user: "me", message: `${input}`}]);
    setchatLog(chatLogNew);
    setinput("");
    const messages = chatLogNew.map((message) => message.message)
    const response = await fetch("http://localhost:5000/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentmodel: currentmodel
      })
    });
    const data = await response.json();
    setchatLog([...chatLogNew,{user:"gpt",message: `${data.message}`}])
  }
  return (
    <div className="App">
      <aside className="side_menu">
        <div className="sidemenu_btn" onClick={onClear}>
          <span>+</span>
            New chat
        </div>
        <div className="models">
          <select onChange={(e)=>{ setcurrentmodel(e.target.value) }}>
            {Models.map((model,idx)=> (
              <option key={model.id} value={model.id}>{model.id}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className='chat_box'>
        <div className="chat-log">
          {chatLog.map((message,idx)=>{
            return (
              <ChatMessage key={idx} message={message} />
            )
          })}
        </div>
        <div className="chat-input-holder">
          <form onSubmit= {handleSubmit}>
            <input value={input} onChange={(e) => setinput(e.target.value)} rows='1' className='chat-input-area'/>
          </form>
        </div>
      </section>
    </div>
  );
}
const ChatMessage = ({message}) =>{
  return (
    <div className={`chat-message ${message.user == "gpt"?"chatgpt":""}` }>
      <div className="chat-message-center">
        <div className={`avatar ${message.user == "gpt"?"ultron":"mr_bean"}`}>
          <img className={message.user === "gpt"?'':'mr-bean'} src={message.user === "gpt"?ultron:mrbean}/>
        </div>
        <div className="message">{
          message.message
        }
        </div>
      </div>
    </div>
  )
}

export default App;
