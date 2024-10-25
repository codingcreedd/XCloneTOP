import { useContext, useEffect, useState } from "react";
import Nav from "../Home/Nav";
import users_api from "../../apis/user";
import Loader from "../PopUps/Loader";
import MessageButton from "../MessageButton";
import { Context } from "../../context/ContextProvider";

export default function MessageList() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const {userId} =  useContext(Context);

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
          <h1 className="text-3xl font-bold mb-6 max-md:text-xl">Messages</h1>
          {/* Profile Cards */}
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
                loading && <Loader />
            }
            {
                users.length > 0 ? (
                    <>
                        {users.map((user) => (
                            <div key={user.id} className={`bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-10 ${user?.id === userId && 'hidden'}`}>
                                <div className="flex items-center space-x-4">
                                <img src={user?.pfpUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                                    <p className="text-gray-400 text-sm">@{user?.username}</p>
                                </div>
                                </div>
                                <p className="text-gray-300 text-xs mt-3 line-clamp-2">
                                {user?.bio}
                                </p>
                                <MessageButton className={`w-full bg-blue-500 text-white mt-4 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-200`} userId={user?.id} />
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