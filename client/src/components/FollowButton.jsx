import React from 'react'

const FollowButton = ({className, userId, onClick_, isFollowing}) => {

  const classes = `${className || 'bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-opacity-90'}`

  return (
    <button className={classes} onClick={onClick_}>
        {
          !isFollowing ? 'Follow' : 'Unfollow'
        }
    </button>
  )
}

export default FollowButton