import React, { useContext } from 'react'
import { Context } from '../context/ContextProvider';

const Message = ({msg}) => {

    const {userId} = useContext(Context);

  return (
    <div key={msg?.id} className={`flex ${msg?.User?.userId === userId ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${msg?.User?.userId === userId ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'} backdrop-filter backdrop-blur-lg rounded-lg px-4 py-2 shadow-sm`}>
            {!(msg?.User?.userId === userId) && <p className="font-medium text-xs mb-1 text-white text-opacity-60">{msg?.User?.username}</p>}
            {msg.content && <p className="text-sm">{msg?.description}</p>}
            {msg.imageUrl && <img src={msg.imageUrl} alt="Shared image" className="mt-2 rounded-md max-w-full h-auto" />}
            <p className="text-xs text-white text-opacity-60 mt-1 text-right">{msg?.createdAt}</p>
        </div>
    </div>
  )
}

export default Message