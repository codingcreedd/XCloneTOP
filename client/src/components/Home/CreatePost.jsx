import React, { useContext, useState } from 'react'
import posts_api from '../../apis/post'
import { Context } from '../../context/ContextProvider';
import Loader from '../PopUps/Loader';

const CreatePost = () => {

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const {setForYou, setFollowingPosts, forYou, followingPosts} = useContext(Context);
  
  const token = localStorage.getItem("token");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
        await posts_api.post('/create', {
          description, isReply: false, parentId: null
        }, {headers: {Authorization: `Bearer ${token}`}})
        .then(response => {
          setLoading(false);
          if(response.status === 201) {
            setDescription('');
            setForYou([...forYou, response.data.post]);
            setFollowingPosts([...followingPosts, response.data.post]);
          }
          console.log(response.data.post);
        })
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <form className="bg-white relative bg-opacity-5 rounded-lg p-4 mb-6" onSubmit={handleCreatePost}>
      {
        loading && <Loader />
      }
              <div className="flex items-start space-x-4">
                <img src="/placeholder.svg?height=40&width=40" alt="Your Profile" className="w-10 h-10 rounded-full" />
                <div className="flex-grow">
                  <textarea
                    className="w-full bg-transparent border-b border-white border-opacity-20 resize-none focus:outline-none focus:border-opacity-50 placeholder-gray-500"
                    placeholder="What's happening?"
                    value={description}
                    onChange={(e) => {setDescription(e.target.value)}}
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
                    <button type='submit' className="bg-blue-500 text-white px-4 py-1 rounded-full font-medium hover:bg-blue-600">Post</button>
                  </div>
                </div>
              </div>
    </form>
  )
}

export default CreatePost