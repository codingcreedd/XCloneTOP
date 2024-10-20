import { useState, useRef, useEffect } from 'react'
import users_api from '../../apis/user'
import Loader from '../PopUps/Loader'
import Message from '../Message'
import { useParams } from 'react-router-dom'

export default function Component() {
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
    
  const token = localStorage.getItem("token");

  const {user_id} = useParams();


  const handleSubmit = (e) => {
    e.preventDefault()
  }

  // const handleImageSelect = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedImage(e.target.files[0])
  //   }
  // }

  useEffect(() => {
    const fetchChat = async () => {
        setLoading(true);
        await users_api.get(`/chat/${user_id}`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(response => {
            if(response.status === 200) {
                setLoading(false);
                setMessages(response.data.chat.messages);
                // setUsers(response.data.chat.users.filter(user => user_id === user.id));
                const userIdNum = Number(user_id);
                const arr = response.data.chat.users.filter(user => userIdNum === user.id);
                console.log(arr)
            }
        })
    }

    fetchChat();
  }, [user_id])

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg px-4 py-3 flex items-center border-b border-white border-opacity-20">
        <button 
          onClick={() => window.history.back()} 
          className="mr-4 hover:bg-white hover:bg-opacity-10 p-1 rounded-md transition-colors duration-200"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {
          users && (
            <h1 className="text-sm font-medium">Chat with {users[0]}</h1>
          )
        }
      </nav>

      {/* Chat Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {
            loading && <Loader />
        }
        {
          messages && (
            <div>
                {messages.map((msg) => (
                  <Message msg={msg} />
                ))}
            </div>
          )
        }
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-4 border-t border-white border-opacity-20">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white bg-opacity-10 text-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white placeholder-white placeholder-opacity-50"
          />
          <button
            type="button"
            className="bg-white bg-opacity-10 text-white rounded-md p-2 hover:bg-opacity-20 transition-colors duration-200"
            aria-label="Attach image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
          <button
            type="submit"
            className="bg-white text-black rounded-md p-2 hover:bg-opacity-80 transition-colors duration-200"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* {selectedImage && (
          <div className="mt-2 text-sm text-white text-opacity-80">
            Image selected: {selectedImage.name}
          </div>
        )} */}
      </form>
    </div>
  )
}