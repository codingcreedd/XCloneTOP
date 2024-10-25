import React, {useState} from 'react'
import Nav from '../Home/Nav'
import users_api from '../../apis/user';
import posts_api from '../../apis/post';
import UserCard from '../UserCard';
import Post from '../Post';
import Loader from '../PopUps/Loader';

const ExplorePage = () => {
    const [searchType, setSearchType] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [postList, setPostList] = useState([]);
    const [userList, setUserList] = useState([]);

    const token = localStorage.getItem("token");

    const handleSearch = async () => {
        console.log(searchType)
        setLoading(true);
        if(searchType === 'users' && (searchQuery !== '' || searchQuery !== null)) {
            await users_api.get('/search', {
                params: { searchedUser: searchQuery},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log(response.data)
                if(response.status === 200) {
                    setUserList(response.data.users);
                }
            })
        } else {
            await posts_api.get('/search', {
                params: { searchedPost: searchQuery},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if(response.status === 200) {
                    setPostList(response.data.posts);
                }
            })
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-black text-white">
          {/* Navigation Bar */}
          <Nav />
    
          {/* Main Content */}
          <main className="relative pt-20 pb-8 max-w-3xl mx-auto px-4">
            {
                loading && <Loader />
            }
            <h1 className="text-3xl font-bold mb-6 max-md:text-xl">Explore</h1>
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for users or posts..."
                  className="w-full bg-white bg-opacity-10 max-md:text-sm max-md:rounded-lg max-md:px-3 max-md:py-2 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg onClick={handleSearch} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 max-md:h-4 max-md:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
    
            {/* Search Type Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 max-md:px-2 max-md:py-1 max-md:text-sm  rounded-full ${searchType === 'users' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-gray-300'}`}
                onClick={() => setSearchType('users')}
              >
                Users
              </button>
              <button
                className={`px-4 py-2 max-md:px-2 max-md:py-1 max-md:text-sm rounded-full ${searchType === 'posts' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-gray-300'}`}
                onClick={() => setSearchType('posts')}
              >
                Posts
              </button>
            </div>
    
            {/* Search Results */}
            {searchType === 'users' && userList.length > 0 ? (
              <div className="space-y-4">
                {userList.map((user) => (
                  <div key={user.id} className="bg-white bg-opacity-5 rounded-lg p-4 flex items-center justify-between">
                    <UserCard user={user} onExplore={true}/>
                  </div>
                ))}
              </div>
            ) : searchType === 'posts' && postList.length > 0 ? (
              <div className="space-y-4">
                {postList.map((post) => (
                  <div key={post.id} className="bg-white bg-opacity-5 rounded-lg p-4">
                    <Post post={post}/>
                  </div>
                ))}
              </div>
            ) : searchType === 'users' && userList.length === 0 ? (
                <p>No users to see</p> 
            ) : searchType === 'posts' && postList.length === 0 ?  (
                <p>No posts to see</p>
            ) : (null) }
          </main>
        </div>
      )
}

export default ExplorePage