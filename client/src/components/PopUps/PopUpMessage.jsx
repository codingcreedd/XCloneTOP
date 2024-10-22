import React from 'react'

const PopUpMessage = ({message, status}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${status === 'success' ? 'bg-green-600' : 'bg-red-600'} bg-opacity-80 rounded-md p-2 shadow-lg border border-white border-opacity-10 flex items-center space-x-2`}>
        <span className="text-white text-xs font-medium">{message}</span>
      </div>
    </div>
  )
}

export default PopUpMessage