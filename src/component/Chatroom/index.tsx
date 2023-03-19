import React, { useEffect, useRef, useState } from "react";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useDeployer } from "../../hooks/useDeployer";
import { useNavigate } from "react-router-dom";
import style from "./style.css";

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
} as const;

const chatbotMachine = createMachine(
  {
    predictableActionArguments: true,
    id: "chatbot",
    initial: "idle",
    context: {
      messages: [],
      name: "",
      amount: "",
      description: "",
      imageUrl: "",
      link: "",
    },
    states: {
      idle: {
        on: {
          START: "greeting",
        },
      },
      greeting: {
        entry: "sendGreetingMessage",
        after: {
          1000: 'inputName',
        }
      },
      inputName: {
        entry: "sendInputNameMessage",
        on: {
          INPUT_NAME: {
            target: "confirmName",
            cond: 'isEnterText',
            actions: "setName",
          },
        },
      },
      confirmName: {
        entry: "sendConfirmNameMessage",
        on: {
          NAME_CONFIRMED: "inputAmount",
          INPUT_NAME: "inputName",
        },
      },
      inputAmount: {
        entry: "sendInputAmountMessage",
        on: {
          INPUT_AMOUNT: {
            target: "confirmAmount",
            cond: 'isEnterText',
            actions: "setAmount",
          },
        },
      },
      confirmAmount: {
        entry: "sendConfirmAmountMessage",
        on: {
          AMOUNT_CONFIRMED: "inputDescription",
          INPUT_AMOUNT: "inputAmount",
        },
      },
      inputDescription: {
        entry: "sendInputDescriptionMessage",
        on: {
          INPUT_DESCRIPTION: {
            target: "confirmDescription",
            cond: 'isEnterText',
            actions: "setDescription",
          }
        },
      },
      confirmDescription: {
        entry: "sendConfirmDescriptionMessage",
        on: {
          DESCRIPTION_CONFIRMED: "generateImage",
          INPUT_DESCRIPTION: "inputDescription",
        },
      },
      generateImage: {
        entry: "sendGenerateImageMessage",
        invoke: {
          src: (context, event) => (callback) => {
            fetch("https://genftai.glitch.me/api/generateimg", {
              ...POST_HEADER,
              body: JSON.stringify({
                description: context.description,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                callback({ type: "IMAGE_GENERATED", imageUrl: data.url });
              });
          },
        },
        on: {
          IMAGE_GENERATED: {
            target: "confirmImage",
            actions: "saveImage",
          },
        },
      },
      confirmImage: {
        on: {
          IMAGE_CONFIRMED: "payment",
          GENERATE_IMAGE: "generateImage",
        },
      },
      payment: {
        entry: "sendPaymentMessage",
        invoke: {
          src: 'deploy',
          onError: 'payment'
        },
        on: {
          PAYMENT_SUCCESS: {
            target: "success",
            actions: 'saveLink'
          }
        }
      },
      success: {
        entry: "sendSuccessMessage",
        type: "final",
      },
    },
  },
  {
    actions: {
      setName: assign((context, event) => ({
        name: event.name,
        messages: [...context.messages, {
          sender_type: 'user',
          msg_type: 'text',
          content: event.name
        }]
      })),
      setAmount: assign((context, event) => ({
        amount: event.amount,
        messages: [...context.messages, {
          sender_type: 'user',
          msg_type: 'text',
          content: event.amount
        }]
      })),
      setDescription: assign((context, event) => ({
        description: event.description,
        messages: [...context.messages, {
          sender_type: 'user',
          msg_type: 'text',
          content: event.description
        }]
      })),
      saveImage: assign((context, event) => ({
        imageUrl: event.imageUrl,
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'img',
          content: event.imageUrl
        }]
      })),
      saveLink: assign((context, event) => ({
        link: event.link,
      })),
      sendGreetingMessage: assign({
        messages: [{
          sender_type: 'bot',
          msg_type: 'text',
          content: '歡迎使用 Gen NFT AI 我是娟娟，我能夠幫您輕鬆的創照出您所想像的ＮＦＴ！'
        }],
      }),
      sendInputNameMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請先輸入 NFT 名稱！'
        }]
      })),
      sendConfirmNameMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請確認 NFT 名稱正確'
        }]
      })),
      sendInputAmountMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請輸入 NFT 數量'
        }]
      })),
      sendConfirmAmountMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請確認數量'
        }]
      })),
      sendInputDescriptionMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請描述一下您 NFT 樣子'
        }]
      })),
      sendConfirmDescriptionMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '請確描述內容'
        }]
      })),
      sendGenerateImageMessage: assign((context) => ({
        messages: [...context.messages, {
          sender_type: 'bot',
          msg_type: 'text',
          content: '圖片生成中...'
        }]
      })),
      sendPaymentMessage: () => {
        console.log("send payment message");
      },
      sendSuccessMessage: assign((context) => ({
        messages: [...context.messages,
        {
          sender_type: 'bot',
          msg_type: 'text',
          content: '完成！這是您的 NFT 網頁：'
        },
        {
          sender_type: 'bot',
          msg_type: 'link',
          content: context.link
        },
        ]
      })),
    },
  }
);

export default function ChatRoom() {
  const deployer = useDeployer();
  const messageRef = useRef<HTMLDivElement>();
  const [inputText, setInputText] = useState("");
  const [state, send] = useMachine(chatbotMachine, {
    guards: {
      isEnterText: () => inputText.trim().length > 0,
    },
    services: {
      deploy: (context) => (callback) => deployer.charge().then(res => {
        fetch("https://genftai.glitch.me/api/getjsonurl", {
          ...POST_HEADER,
          body: JSON.stringify({
            name: context.name,
            description: context.description,
            imageUrl: context.imageUrl,
          }),
        }).then(res => res.json()).then((data) => {
          localStorage.setItem("projectInfo", JSON.stringify({
            ...context,
            mintAmount: context.amount,
            resultLink: `/genftai/web?imgUrl=${context?.imageUrl}&projectName=${context?.name}&jsonUrl=${data?.url}`,
            jsonUrl: data.url,
          }));
          callback({ type: 'PAYMENT_SUCCESS', link: `/genftai/web?imgUrl=${context?.imageUrl}&projectName=${context?.name}&jsonUrl=${data?.url}` });
        })
      }).catch(err => {
        console.log(err)

      })
    }
  });
  let inputs;


  const enterInput = (e) => {
    if (e.key === 'Enter' || e.type === 'click')
      switch (state.value) {
        case 'inputName':
          send({ type: 'INPUT_NAME', name: inputText })
          setInputText('');
          break;
        case 'inputAmount':
          send({ type: 'INPUT_AMOUNT', amount: inputText })
          setInputText('');
          break;
        case 'inputDescription':
          send({ type: 'INPUT_DESCRIPTION', description: inputText })
          setInputText('');
          break;
        default:
          break;
      }
  }

  switch (state.value) {
    case 'idle':
      inputs = (
        <button
          onClick={() => {
            send('START');
          }}
          className="select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 px-52 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200"
        >
          START
        </button>
      );
      break;
    case 'inputName':
    case 'inputAmount':
    case 'inputDescription':
      inputs = (
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
        </div>
      );
      break;
    case 'confirmName':
    case 'confirmAmount':
    case 'confirmDescription':
    case 'confirmImage': {
      let event
      if (state.matches('confirmName')) {
        event = {
          reset: 'INPUT_NAME',
          resetText: 'Reset Name',
          confirm: 'NAME_CONFIRMED'
        }
      }
      if (state.matches('confirmAmount')) {
        event = {
          reset: 'INPUT_AMOUNT',
          resetText: 'Reset Amount',
          confirm: 'AMOUNT_CONFIRMED',

        }
      }
      if (state.matches('confirmDescription')) {
        event = {
          reset: 'INPUT_DESCRIPTION',
          resetText: 'Reset Description',
          confirm: 'DESCRIPTION_CONFIRMED'
        }
      }
      if (state.matches('confirmImage')) {
        event = {
          reset: 'GENERATE_IMAGE',
          resetText: 'Regenerate Image',
          confirm: 'IMAGE_CONFIRMED'
        }
      }
      inputs = (
        <div className='w-full space-x-2 flex flex-row justify-center'>
          <button onClick={() => {
            send(event.reset);
          }} className='w-1/3 select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200'>{event.resetText}</button>
          <button onClick={() => {
            send(event.confirm);
          }} className='w-1/3 select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 font-bold text-blue-500 transition-colors duration-200 ease-in-out active:bg-blue-200 active:text-blue-900 active:border-blue-200'>Confirm</button>
        </div>
      );
      break;
    }
    default:
      break;
  }

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, []);

  return (
    <>
      <div className="flex-1 p-2 sm:p-6 flex flex-col h-screen">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1591927597960-95cf948f8028?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt=""
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">GEN NFT AI</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div
          ref={messageRef}
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {
            state.context.messages.map((msg, index) => msg.sender_type == 'bot' ? <BotMessage key={index} {...msg} /> : <MyMessage key={index} {...msg} />)
          }
        </div>
        <div className="flex flex-col border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          {inputs}
        </div>
      </div>
    </>
  );
}

const BotMessage = ({ msg_type, content }) => {
  const navigate = useNavigate();
  let message;

  switch (msg_type) {
    case 'text':
      message = (
        <div>
          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
            {content}
          </span>
        </div>
      )
      break;
    case 'img':
      message = (
        <div>
          <img src={content} alt="" />
        </div>
      )
      break;
    case 'link':
      message = (
        <div>
          <a
            className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
            onClick={() => {
              navigate(content);
            }}
          >
            https://nft.com
          </a>
        </div>
      )
      break;
    default:
      break;
  }
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          {message}
        </div>
      </div>
    </div>
  );
};
const MyMessage = ({ content }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
              {content}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
