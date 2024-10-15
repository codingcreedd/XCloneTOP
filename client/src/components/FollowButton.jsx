import React from 'react'

const FollowButton = ({className, userId}) => {

  const classes = `${className || 'bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-opacity-90'}`

  return (
    <button className={classes}>
        Follow
    </button>
  )
}

export default FollowButton