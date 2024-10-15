import { useState } from 'react'

export default function Component() {
  const [searchType, setSearchType] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm border-b border-white border-opacity-10 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-xl font-bold">Chatterbox</a>
              <a href="#" className="hover:text-gray-300">Home</a>
              <a href="#" className="text-blue-400">Explore</a>
              <a href="#" className="hover:text-gray-300">Messages</a>
              <a href="#" className="hover:text-gray-300">Bookmarks</a>
              <a href="#" className="hover:text-gray-300">Profile</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-opacity-90">New Post</button>
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="font-medium">Username</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Explore</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for users or posts..."
              className="w-full bg-white bg-opacity-10 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Type Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full ${searchType === 'users' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-gray-300'}`}
            onClick={() => setSearchType('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 rounded-full ${searchType === 'posts' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-gray-300'}`}
            onClick={() => setSearchType('posts')}
          >
            Posts
          </button>
        </div>

        {/* Search Results */}
        {searchType === 'users' ? (
          <div className="space-y-4">
            {[1, 2, 3].map((user) => (
              <div key={user} className="bg-white bg-opacity-5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder.svg?height=48&width=48" alt="User Avatar" className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-gray-400 text-sm">@johndoe</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition duration-200">
                    Follow
                  </button>
                  <button className="bg-white bg-opacity-10 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-20 transition duration-200">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="bg-white bg-opacity-5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img src="/placeholder.svg?height=40&width=40" alt="User Profile" className="w-10 h-10 rounded-full" />
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">John Doe</span>
                      <span className="text-gray-500 text-sm">@johndoe</span>
                      <span className="text-gray-500 text-sm">· 2h</span>
                    </div>
                    <p className="mt-2">This is a sample post content that matches the search query. It can be quite long and may contain multiple lines of text.</p>
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
          </div>
        )}
      </main>
    </div>
  )
}