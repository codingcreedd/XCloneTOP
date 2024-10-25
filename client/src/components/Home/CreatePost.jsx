import React, { useContext, useState } from 'react'
import posts_api from '../../apis/post'
import { Context } from '../../context/ContextProvider';
import Loader from '../PopUps/Loader';

const CreatePost = ({isReply, message, parentId, replies, setReplies}) => {

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const {setForYou, setFollowingPosts, forYou, followingPosts} = useContext(Context);
  
  const token = localStorage.getItem("token");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try { 
        if(description !== '' && description !== null) {
          setLoading(true);

          const formData = new FormData();
          formData.append("description", description);


          if(parentId){
            formData.append("parentId", parentId);
          }

          formData.append("isReply", isReply);

          if(selectedImage)
            formData.append("image", selectedImage);

          await posts_api.post('/create', formData, {headers: {Authorization: `Bearer ${token}`}})
          .then(response => {
            setLoading(false);
            if(response.status === 201) {
              setDescription('');
              setForYou([response.data.post, ...forYou]);
              setFollowingPosts([response.data.post,...followingPosts]);

              if(isReply){
                setReplies([response.data.post, ...replies])
              } 
            }
          })
        }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <form className={`bg-white relative bg-opacity-5 ${isReply ? 'rounded-bl-lg rounded-br-lg' : 'rounded-lg'} p-4 mb-6`} onSubmit={handleCreatePost}>
      {
        loading && <Loader />
      }
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <textarea
                    className="w-full bg-transparent border-b border-white border-opacity-20 resize-none focus:outline-none focus:border-opacity-50 placeholder-gray-500"
                    placeholder={message || 'Whats happening'}
                    value={description}
                    onChange={(e) => {setDescription(e.target.value)}}
                    rows={3}
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                      <label htmlFor='image-post-upload' className="text-blue-400 hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                      </label>

                      <input
                        id="image-post-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {setSelectedImage(e.target.files[0])}}
                        className="hidden"
                      />

                    </div>
                    <button type='submit' className="bg-blue-500 text-white px-4 py-1 rounded-full max-md:px-2 max-md:text-sm font-medium max-md:rounded-lg hover:bg-blue-600">Post</button>
                  </div>
                </div>
              </div>
    </form>
  )
}

export default CreatePost