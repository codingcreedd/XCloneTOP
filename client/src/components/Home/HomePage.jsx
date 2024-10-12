import { useState } from 'react'
import WhoToFollow from './WhoToFollow'
import Nav from './Nav'
import CreatePost from './CreatePost'
import Trending from './Trending'
import Post from '../Post'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="pt-20 pb-8 max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Sidebar */}
          <Trending />

          {/* Main Feed */}
          <div className="lg:w-1/2">
            {/* Tabs */}
            <div className="flex mb-6 bg-white bg-opacity-5 rounded-lg">
              <button
                onClick={() => setActiveTab('for-you')}
                className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'for-you' ? 'bg-blue-500 text-white' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                For You
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'following' ? 'bg-blue-500 text-white' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                Following
              </button>
            </div>

            {/* New Post Creation */}
            <CreatePost />

            {/* Posts */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((post) => (
                <Post post={post}/>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <WhoToFollow />
        </div>
      </main>
    </div>
  )
}