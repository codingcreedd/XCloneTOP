import React, { useContext, useEffect } from 'react'
import FollowButton from './FollowButton';
import { Context } from '../context/ContextProvider';
import MessageButton from './MessageButton'

const UserCard = ({user, onExplore}) => {

    const {userId} = useContext(Context);


  return (
    <div key={user.id} className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
        <img src="/placeholder.svg?height=40&width=40" alt="User Avatar" className="w-10 h-10 rounded-full" />
        <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-500 text-sm">@{user.username}</div>
        </div>
        </div>
        <div className='flex gap-5 items-center'>
          {
            user.id !== userId && <FollowButton userId={user.id}/>
          }
          {
            onExplore && <MessageButton userId={user.id}/>
          }
        </div>
    </div>
  )
}

export default UserCard