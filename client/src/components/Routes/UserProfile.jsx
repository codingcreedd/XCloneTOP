import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Nav from '../Home/Nav';
import users_api from '../../apis/user';
import Loader from '../PopUps/Loader';
import ProfileList from './ProfileList';
import posts_api from '../../apis/post';
import EditProfile from '../PopUps/EditProfile';
import { Context } from '../../context/ContextProvider';
import MessageButton from '../MessageButton';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const [isFollower, setIsFollower] = useState(null);

  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [likes, setLikes] = useState([]);

  const [editProfile, setEditProfile] = useState(false);

  const {username} = useParams();

  const token = localStorage.getItem("token");

  const {userId} = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            setLoading(true);
            setTabLoading(true);
            const [userProfileResponse, userPostsResponse] = await Promise.all([
                users_api.get(`/${username}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                posts_api.get(`/${username}/posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            if(userProfileResponse.status === 200) {
                setLoading(false);
                setUserProfile(userProfileResponse.data.userInfo)
                
                let isFollower = false;
                const followers = [...userProfileResponse.data.userInfo.followedBy];
                
                //binary search if this client is a follower of a user
                let start = 0;
                let end = followers.length - 1;

                while(start <= end) {
                  let middle = Math.floor((start + end) / 2);

                  if(followers[middle].id === userId){
                    isFollower = true;
                    break;
                  }

                  if(followers[middle].id > userId) 
                    end = middle - 1;
                  

                  if(followers[middle].id < userId)
                    start = middle + 1;

                }

                setIsFollower(isFollower);


            }
            
            if(userPostsResponse.status === 200) {
                setTabLoading(false);
                setPosts(userPostsResponse.data.posts)
            }


        } catch(err) {
            console.error(err);
        }
    }

    fetchUser();
  }, [username]);

  const handlePostFetch = async (tab)  => {
    setTabLoading(true);
    try {
        const tabL = tab.toLowerCase();
        
        await posts_api.get(`/${tabL === 'posts' ? `${username}`: `${userProfile?.id}`}/${tabL}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if(response.status === 200) {
                setTabLoading(false);
                tabL === "replies" ? setReplies(response.data.replies) : 
                tabL === "bookmarks" ? setBookmarks(response.data.bookmarks) :
                tabL === "likes" ? setLikes(response.data.likes) : null
            }
        })
        
    } catch(err) {
        setTabLoading(false);
        console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Navigation Bar */}
      <Nav/>

      {/* Main Content */}
      <main className="relative pt-16 pb-8">
        {/* User Info Section */}
        <div className="relative">
        {
            loading && <Loader />
        }
          <div className="h-48 bg-gray-800">
            <img src="/placeholder.svg?height=192&width=1024" alt="Banner" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <img src="/placeholder.svg?height=128&width=128" alt="Profile" className="h-24 w-24 rounded-full ring-4 ring-black sm:h-32 sm:w-32" />
              </div>
              <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-white truncate">{userProfile?.name}</h1>
                </div>
                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                  {
                    userProfile?.id === userId && (
                      <button onClick={() => {setEditProfile(true)}} type="button" className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Edit Profile
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-6">
            <div className="text-gray-300">@{userProfile?.username}</div>
            <div className="mt-2 text-sm text-gray-400">Joined {userProfile?.createdAt}</div>
            <p className="mt-4 text-sm text-gray-300">
                {userProfile?.bio}
            </p>
            <div className="mt-4 flex items-center space-x-6">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{userProfile?.following?.length}</span> Following
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{userProfile?.followedBy?.length}</span> Followers
              </div>
              {
                isFollower !== null && (
                  <div>
                    {
                      (userId !== userProfile?.id && isFollower) && (
                        <MessageButton userId={userProfile?.id}/>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>

          {
            editProfile ? (<EditProfile cancel={() => {setEditProfile(false)}}/>) : (
              <>
                {/* Tabs */}
                <div className="mt-6 border-b border-gray-700">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['Posts', 'Replies', 'Bookmarks', 'Likes'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {setActiveTab(tab.toLowerCase()); handlePostFetch(tab);}}
                        className={`${
                          activeTab === tab.toLowerCase()
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content based on active tab */}
                <div className=" relative mt-6">
                  {
                      tabLoading && <Loader />
                  }
                  {activeTab === 'posts' && <ProfileList posts={posts}/> }
                  {activeTab === 'replies' && <ProfileList posts={replies}/>}
                  {activeTab === 'bookmarks' && <ProfileList posts={bookmarks}/>}
                  {activeTab === 'likes' && <ProfileList posts={likes}/>}
                </div>
              </>
            )
          }
          
        </div>
      </main>
    </div>
  )
}