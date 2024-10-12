import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../context/ContextProvider'

const Nav = () => {

    const {user} = useContext(Context);

  return (
    <nav className="px-40 fixed top-0 left-0 right-0 bg-black text-xl bg-opacity-80 backdrop-filter backdrop-blur-sm border-b border-white border-opacity-10 z-10">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold">BLIP</a>
            <div className="flex items-center space-x-4">
              <Link to={`/`} className="hover:text-gray-300">Home</Link>
              <Link to={`/explore`} className="hover:text-gray-300">Explore</Link>
              <Link to={`/messages`} className="hover:text-gray-300">Messages</Link>
              <Link to={`/bookmarks`} className="hover:text-gray-300">Bookmarks</Link>
              <Link to={`/${user?.username}/profile`} className="hover:text-gray-300">Profile</Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="font-medium">Username</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Nav