import React from 'react'
import { useNavigate } from 'react-router-dom'

const MessageButton = ({className, userId}) => {

    const classes = `${className || 'bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-opacity-90'}`

    const navigate = useNavigate();

  return (
    <button className={classes} onClick={() => {navigate(`/chat/${userId}`)}}>
        Message
    </button>
  )
}

export default MessageButton