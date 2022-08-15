
import './App.css';

import { io } from "socket.io-client"
import { ReactElement, useEffect, useState } from 'react';

interface MsgBack {
  name: string,
  msg: string,
}
interface MsgProps {
  name: string,
  msg: string,
  date: number,
}

let socket:any = null

function App() {

  const [inputVal, setInputVal] = useState('')
  const [nameVal, setNameVal] = useState('')

  const sendMsg = ():void => {
    if (inputVal) {
      socket.emit('chat message', {
        name: nameVal,
        msg: inputVal
      })
      setInputVal('')
    }
  }

  const [msgVal, setMsgVal] = useState<MsgProps []>([])

  const reveiceMsg = (msg:MsgBack) => {

    console.log(msg);
    

    let msgInf:Array<MsgProps> = [...msgVal, {
      ...msg,
      date: +new Date()
    }]
    
    setMsgVal(msgInf)
  }

  const socketMsg = ():void => {
    socket = io("http://119.45.242.136:8717", {
      transports: ['websocket']
    });
  }

  useEffect(()=>{
    socketMsg()

    return () => {
      socket.disconnect()
    }
  },[])

  
  useEffect(()=>{
    console.log(msgVal, 'mmp')
    socket.on('chat message', reveiceMsg)
  }, [msgVal])

  return (
    <div className="App">
      <ul id='msg-list'>
        {
          msgVal.map((item):ReactElement=>{
            return (
              <li key={item.date}>
                <span id='show-name'>{ item.name }</span>
                { item.msg }
              </li>
            )
          })
        }
      </ul>
      <div className='sub-wrap'>
        <input id='name-input' placeholder='名' type="text" value={nameVal} onChange={(val) => { setNameVal(val.target.value) }} />
        <input id='msg-input' type="text" value={inputVal} onChange={(val) => { setInputVal(val.target.value) }} />
        <button className={!inputVal.trim() ? 'is-Ban' : ''} disabled={!inputVal.trim()} onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
}

export default App;
