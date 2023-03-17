import React, { useEffect, useRef, useState } from 'react'
import { assign, createMachine, sendTo } from "xstate";
import { useMachine } from "@xstate/react";
import style from './style.css'
import { useDeployer } from '../../hooks/useDeployer';
import { useNavigate } from 'react-router-dom';

const POST_HEADER = {
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "user-agent": "Mozilla/4.0 MDN Example",
    "content-type": "application/json",
  },
  method: "POST",
  mode: "cors",
  redirect: "follow",
  referrer: "no-referrer",
} as const

const STATES = {
  START: 'START',
  GREET: 'GREET',
  INPUT_NAME: 'INPUT_NAME',
  INPUT_AMOUNT: 'INPUT_AMOUNT',
  INPUT_DESCRIPTION: 'INPUT_DESCRIPTION',
  CONFIRMING: 'CONFIRMING',
  GENERATING_NFT: 'GENERATING_NFT',
  PAYING: 'PAYING',
  SUCCESS: 'SUCCESS',
} as const

const EVENTS = {
  CLICK_START: 'CLICK_START',
  SEND_MESSAGE: 'SEND_MESSAGE',
  ENTER_NFT_AMOUNT: 'ENTER_NFT_AMOUNT',
  ENTER_NFT_DESCRIPTION: 'ENTER_NFT_DESCRIPTION',
  GENERATE_NFT: 'GENERATE_NFT',
  CONFIRM_NFT: 'CONFIRM_NFT',
  PAYMENT: 'PAYMENT',
} as const;

const assignProjectName = assign({
  projectName: (_, event) => event.projectName
});

const assignAmount = assign({
  amount: (_, event) => event.amount
});

const assignDescription = assign({
  description: (_, event) => event.description
});

const assignImgUrl = assign({
  imgUrl: (_, event) => event.imgUrl
});

const chatbot = createMachine({
  predictableActionArguments: true,
  id: "chatbot",
  initial: STATES.START,
  context: {
    projectName: '',
    amount: '',
    description: '',
    imgUrl: '',
  },
  states: {
    [STATES.START]: {
      on: {
        [EVENTS.CLICK_START]: {
          target: STATES.GREET,
          actions: 'greet',
        }
      },
    },
    [STATES.GREET]: {
      after: {
        1000: { target: STATES.INPUT_NAME, actions: 'botReplyEnterName', }
      }
    },
    [STATES.INPUT_NAME]: {
      on: {
        [EVENTS.ENTER_NFT_AMOUNT]: [
          {
            target: STATES.INPUT_AMOUNT,
            cond: 'isEnterText',
            actions: ['enterText', assignProjectName, 'botReplyEnterAmount'],
          }
        ],
      },
    },
    [STATES.INPUT_AMOUNT]: {
      on: {
        [EVENTS.ENTER_NFT_DESCRIPTION]: [
          {
            target: STATES.INPUT_DESCRIPTION,
            cond: 'isEnterText',
            actions: ['enterText', assignAmount, 'botReplyEnterDescription'],
          }
        ],

      },
    },
    [STATES.INPUT_DESCRIPTION]: {
      on: {
        [EVENTS.GENERATE_NFT]:
          [
            {
              target: STATES.GENERATING_NFT,
              cond: 'isEnterText',
              actions: ['enterText', assignDescription],
            }
          ],

      },
    },
    [STATES.GENERATING_NFT]: {
      invoke: {
        src: 'fetchImage',
        onDone: {
          target: STATES.CONFIRMING,
        },
      },
      on: {
        [EVENTS.CONFIRM_NFT]: {
          actions: [assignImgUrl]
        },
      },
    },
    [STATES.CONFIRMING]: {
      on: {
        [EVENTS.GENERATE_NFT]: STATES.GENERATING_NFT,
        [EVENTS.PAYMENT]: STATES.PAYING
      },
    },
    [STATES.PAYING]: {
      invoke: {
        src: 'deploy',
        onDone: {
          target: STATES.SUCCESS,
        },
      },
    },
    [STATES.SUCCESS]: {
      type: 'final',
    },
  },
}, {
  actions: { assignProjectName, assignAmount, assignDescription, assignImgUrl }
});




export default function ChatRoom() {
  const deployer = useDeployer();
  const messageRef = useRef<HTMLDivElement>();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [state, send] = useMachine(chatbot, {
    actions: {
      greet: () => {
        setMessages((s) => [...s, { type: 'bot', msg: 'Welcome to Gen NFT AI I am Juanjuan.' }])
      },
      botReplyEnterName: () => {
        setMessages((s) => [...s, { type: 'bot', msg: 'Please enter your NFT name.' }])
      },
      botReplyEnterAmount: () => {
        setMessages((s) => [...s, { type: 'bot', msg: 'Please enter NFT amount.' }])
      },
      botReplyEnterDescription: () => {
        setMessages((s) => [...s, { type: 'bot', msg: 'Please enter NFT description.' }])
      },
      enterText: () => {
        setMessages((s) => [...s, { type: 'user', msg: inputText }])
      },
    },
    services: {
      fetchImage: (context) =>
        fetch("https://genftai.glitch.me/api/generateimg", {
          ...POST_HEADER,
          body: JSON.stringify({
            description: context.description,
          }),
        }).then(res => res.json()).then((data) => {
          setMessages((s) => [...s, { type: 'bot', img: data.url }])
          send({ type: EVENTS.CONFIRM_NFT, imgUrl: data.url })
        }),
      deploy: (context) => deployer.charge().then(res => {
        fetch("https://genftai.glitch.me/api/getjsonurl", {
          ...POST_HEADER,
          body: JSON.stringify({
            name: context.projectName,
            description: context.description,
            image: context.imgUrl,
          }),
        }).then(res => res.json()).then((data) => {
          localStorage.setItem("projectInfo", JSON.stringify({
            mintAmount: context.amount,
            resultLink: `/genftai/web?imgUrl=${context?.imgUrl}&projectName=${context?.projectName}&jsonUrl=${data?.url}`,
            jsonUrl: data.url,
            ...context
          }));
          setMessages((s) => [...s, { type: 'bot', link: `/genftai/web?imgUrl=${context?.imgUrl}&projectName=${context?.projectName}&jsonUrl=${data?.url}` }])
        })
      }).catch(err => {
        console.log(err)

      })
    },
    guards: {
      isEnterText: () => inputText.trim().length > 0,
    }
  });

  console.log(state.value)
  console.log(state.context)

  const enterInput = (e) => {
    if (e.key !== 'Enter') return;
    switch (state.value) {
      case STATES.INPUT_NAME:
        send({ type: EVENTS.ENTER_NFT_AMOUNT, projectName: inputText })
        setInputText('');
        break;
      case STATES.INPUT_AMOUNT:
        send({ type: EVENTS.ENTER_NFT_DESCRIPTION, amount: inputText })
        setInputText('');
        break;
      case STATES.INPUT_DESCRIPTION:
        send({ type: EVENTS.GENERATE_NFT, description: inputText })
        setInputText('');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [])

  return (
    <>
      <div className="flex-1 p-2 sm:p-6 flex flex-col h-screen">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1591927597960-95cf948f8028?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">GEN NFT AI</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1' />
        <div ref={messageRef} id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {
            messages.map((msg, index) => msg.type == 'bot' ? <BotMessage key={index} message={msg.msg} img={msg.img} link={msg.link} /> : <MyMessage key={index} message={msg.msg} />)
          }
        </div>
        <div className="flex flex-col border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          {state.value == STATES.START
            && <button onClick={() => {
              send(EVENTS.CLICK_START);
            }} className='select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 px-52 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200'>START</button>}
          {(state.value == STATES.INPUT_NAME || state.value == STATES.INPUT_AMOUNT || state.value == STATES.INPUT_DESCRIPTION) && (
            <div className="relative flex">
              <input value={inputText} onKeyDown={enterInput} onChange={({ target }) => {
                setInputText(target.value);
              }} type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 bg-gray-200 rounded-md py-3" />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button onClick={enterInput} type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                  <span className="font-bold">Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>)}
          {
            state.value == STATES.CONFIRMING && (
              <div className='w-full space-x-2 flex flex-row justify-center'>
                <button onClick={() => {
                  send(EVENTS.GENERATE_NFT);
                }} className='w-1/3 select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200'>Regenerate</button>
                <button onClick={() => {
                  send(EVENTS.PAYMENT);
                }} className='w-1/3 select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200'>Confirm</button>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

const BotMessage = ({ message, img, link }) => {
  const navigate = useNavigate();
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          {!!message && <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message}</span></div>}
          {!!img && <div><img src={img} alt="" /></div>}
          {!!link && <div><a
            className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
            onClick={() => {
              navigate(
                link
              );
            }}>https://nft.com</a></div>}
        </div>
      </div>
    </div>
  )
}
const MyMessage = ({ message }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message}</span></div>
        </div>
      </div>
    </div>
  )
}