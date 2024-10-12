export default function Component() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}

      {/* Main Content */}
      <main className="pt-20 pb-8 max-w-2xl mx-auto">
        {/* New Post Creation */}
        <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            <img src="/placeholder.svg?height=40&width=40" alt="Your Profile" className="w-10 h-10 rounded-full" />
            <div className="flex-grow">
              <textarea
                className="w-full bg-transparent border-b border-white border-opacity-20 resize-none focus:outline-none focus:border-opacity-50 placeholder-gray-500"
                placeholder="What's happening?"
                rows={3}
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  <button className="text-blue-400 hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="text-blue-400 hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-full font-medium hover:bg-blue-600">Post</button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-white bg-opacity-5 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <img src="/placeholder.svg?height=40&width=40" alt="User Profile" className="w-10 h-10 rounded-full" />
              <div className="flex-grow">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-gray-500 text-sm">@johndoe</span>
                  <span className="text-gray-500 text-sm">· 2h</span>
                </div>
                <p className="mt-2">This is a sample post content. It can be quite long and may contain multiple lines of text.</p>
                {post === 1 && (
                  <img src="/placeholder.svg?height=300&width=500" alt="Post Image" className="mt-3 rounded-lg w-full" />
                )}
                <div className="flex justify-between mt-4">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span>24</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>5</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>18</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}