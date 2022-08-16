import { io } from "socket.io-client"
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import envConfig from "../../env/process.js"

import { post } from "../../utils/request"

//! scss
import "./index.scss"

interface MsgProps {
  nickid: string,
  his: string,
  date: number,
  color: string
}
interface MsgBackProps {
  id: number,
  nickid: string,
  his: string,
  date: number,
  color: string
}


let env = process.env.NODE_ENV

let socket:any = null

let color = ["#eea2a4", "#2b73af", "#20a162", "#fecc11", "#fc6315", "#863020", "#1772b4", "#b0d5df", "#e77c8e", "#fbb957", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#8B00FF"]

let fontColor = color[parseInt(Math.random() * 10+'')]

const CentMain: React.FC = () => {

  const ulRef = useRef<HTMLUListElement>(null)

  const [inputVal, setInputVal] = useState('')
  const [nameVal, setNameVal] = useState('')

  const sendMsg = (): void => {
    if (inputVal) {
      console.log({
        nickid: nameVal,
        his: inputVal,
        date: +new Date(),
        color: fontColor
      })
      socket.emit('chat message', {
        nickid: nameVal,
        his: inputVal,
        date: +new Date(),
        color: fontColor
      })
      setInputVal('')
    }
  }

  const [msgVal, setMsgVal] = useState<MsgProps[]>([])

  const reveiceMsg = useCallback((msg: MsgProps) => {

    console.log(msg);
    let msgInf: Array<MsgProps> = [...msgVal, {
      ...msg
    }]

    setMsgVal(msgInf)
    console.log(ulRef.current!?.scrollHeight, ulRef.current!?.clientHeight, ulRef.current!?.scrollTop);
    
    setTimeout(()=>{
      ulRef && ulRef.current!.scrollHeight > ulRef.current!.clientHeight && (ulRef.current!.scrollTop = (ulRef.current!.scrollHeight - ulRef.current!.clientHeight) * 2) && console.log(ulRef.current!?.scrollHeight, ulRef.current!?.clientHeight, ulRef.current!?.scrollTop);
    }, 0)
  }, [msgVal])

  const socketMsg = (): void => {
    socket = io(envConfig[env].textUrl, {
      transports: ['websocket']
    });
  }

  useEffect(() => {
    socketMsg()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(()=>{
    socket.on('chat message', reveiceMsg)
    return () => {
      socket.off('chat message', reveiceMsg)
    }
  }, [reveiceMsg])

  const getMsgBack = async () => {
    const res:Array<MsgBackProps> = await post("/shis", {min: 0, max: 20})
    setMsgVal([
      ...msgVal, ...res
    ])
  }

  useEffect(() => {
    getMsgBack()
    return () => {
      
    }
  }, [])

  return (
    <div className="App">
      <ul id='msg-list' ref={ulRef}>
        {
          msgVal.map((item): ReactElement => {
            return (
              <li key={item.date} style={{color: item.color}}>
                <span id='show-name'>{item.nickid}</span>
                {item.his}
              </li>
            )
          })
        }
      </ul>
      <div className='sub-wrap'>
        <input id='name-input' placeholder='名' type="text" value={nameVal} onChange={(val) => { setNameVal(val.target.value) }}/>
        <input id='msg-input' type="text" value={inputVal} onChange={(val) => { setInputVal(val.target.value) }} />
        <button className={!inputVal.trim() ? 'is-Ban' : ''} disabled={!inputVal.trim()} onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
}

export default CentMain