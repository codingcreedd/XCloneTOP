import React from 'react'

const Loader = () => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black bg-opacity-80 rounded-md p-2 shadow-lg border border-white border-opacity-10 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span className="text-white text-xs font-medium">Loading</span>
          </div>
        </div>
      )
}

export default Loader