import { useContext, useEffect, useState } from 'react'
import WhoToFollow from './WhoToFollow'
import Nav from './Nav'
import CreatePost from './CreatePost'
import Trending from './Trending'
import Post from '../Post'
import LatestUsers from './LatestUsers'
import { Context } from '../../context/ContextProvider';
import posts_api from '../../apis/post'
import Loader from '../PopUps/Loader'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  
  const {forYou, followingPosts, setForYou, setFollowingPosts} = useContext(Context);

  // useEffect(() => { fetch for you posts on page load
  //   fetchForYou
  // }, [])

    const fetchForYou = async () => {

    }

    const fetchFollowing = async () => {
      try {
        setLoading(true);
        await posts_api.get('/following-posts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {
          setLoading(false);
          if(response.status === 200){
            setFollowingPosts([...followingPosts, ...response.data.posts]);
          }
        })
      } catch(err) {
        console.error(err);
      }
    }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="pt-20 pb-8 px-40 mx-auto">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Sidebar */}
          <Trending />

          {/* Main Feed */}
          <div className="lg:w-1/2 relative"> 
            {loading && <Loader />}
            {/* Tabs */}
            <div className="flex mb-6 bg-white bg-opacity-5 rounded-lg">
              <button
                onClick={() => setActiveTab('for-you')}
                className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'for-you' ? 'bg-blue-500 text-white' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                For You
              </button>
              <button
                onClick={() => {setActiveTab('following'); fetchFollowing();}}
                className={`flex-1 py-2 text-center rounded-lg ${activeTab === 'following' ? 'bg-blue-500 text-white' : 'hover:bg-white hover:bg-opacity-10'}`}
              >
                Following
              </button>
            </div>

            {/* New Post Creation */}
            <CreatePost />

            {/* Posts */}
            {
              activeTab === 'for-you' && forYou.length > 0 ? (
                <div className="space-y-6">
                  {forYou.map((post, index) => (
                    <div key={index}>
                        <Post post={post}/>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'following' && followingPosts.length > 0 ? (
                <div className="space-y-6">
                  {followingPosts.map((post, index) => (
                    <div key={index}>
                        <Post post={post}/>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No posts to see</p>
              )
            }
          </div>

          {/* Right Sidebar */}
          <div className='flex flex-col min-w-max'>
            <WhoToFollow />
            <LatestUsers />
          </div>

        </div>
      </main>
    </div>
  )
}