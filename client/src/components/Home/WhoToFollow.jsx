import React from 'react'

const WhoToFollow = () => {
  return (
    <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((user) => (
                  <div key={user} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src="/placeholder.svg?height=40&width=40" alt="User Avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-semibold">Jane Smith</div>
                        <div className="text-gray-500 text-sm">@janesmith</div>
                      </div>
                    </div>
                    <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-opacity-90">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
    </div>
  )
}

export default WhoToFollow