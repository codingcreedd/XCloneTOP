import { useEffect, useState } from "react";
import Nav from "../Home/Nav";
import users_api from "../../apis/user";
import Loader from "../PopUps/Loader";

export default function MessageList() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMessageList = async () => {
            setLoading(true);
            await users_api.get('/message-users', {
                headers: {Authorization: `Bearer ${token}`}
            }).then(response => {
                if(response.status === 200) {
                    setLoading(false);
                    setUsers(response.data.users);
                }
            })
        }   

        fetchMessageList();
    }, [])

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Navigation Bar */}
        <Nav />
  
        {/* Main Content */}
        <main className="pt-20 pb-8 max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for users..."
                className="w-full bg-white bg-opacity-10 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
  
          {/* Profile Cards */}
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
                loading && <Loader />
            }
            {
                users.length > 0 ? (
                    <>
                        {users.map((user) => (
                            <div key={user} className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-10">
                                <div className="flex items-center space-x-4">
                                <img src="/placeholder.svg?height=64&width=64" alt="User Avatar" className="w-16 h-16 rounded-full" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                                    <p className="text-gray-400 text-sm">@{user?.username}</p>
                                </div>
                                </div>
                                <p className="text-gray-300 text-xs mt-3 line-clamp-2">
                                {user?.bio}
                                </p>
                                <button className="w-full bg-blue-500 text-white mt-4 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-200">
                                Message
                                </button>
                            </div>
                          ))}
                    </>
                ) : (
                    <p>No chats yet</p>
                )
            }
          </div>
        </main>
      </div>
    )
  }