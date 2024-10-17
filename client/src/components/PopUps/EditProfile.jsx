import { useEffect, useState } from 'react'
import users_api from '../../apis/user';
import { useNavigate } from 'react-router-dom';
import Loader from '../PopUps/Loader';

export default function EditProfile({cancel}) {
  const [name, setName] = useState(null)
  const [username, setUsername] = useState(null)
  const [bio, setBio] = useState(null)
  const [avatar, setAvatar] = useState(null);

  const [newName, setNewName] = useState(null)
  const [newUsername, setNewUsername] = useState(null)
  const [newBio, setNewBio] = useState(null)
  const [newAvatar, setNewAvatar] = useState(null);

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    console.log(`NAME: ${newName} + USERNAME: ${newUsername} + BIO: ${newBio}`)
    e.preventDefault()
    try {
        setUpdateLoading(true);
        await users_api.put('/update-user-info', {
            newName,
            newUsername,
            newBio
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if(response.status === 201) {
                setUpdateLoading(false);
                navigate(0);
            }
        })
    } catch(err) {
      console.error(err);
    }
  }

  const handleAvatarChange = (e) => {
    
  }

  useEffect(() => {
    const fetchProfile = async () => {
        setLoading(true);
        await users_api.get('/edit-profile-info', {
          headers: {Authorization: `Bearer ${token}`}
        }).then(response => {
          if(response.status === 200) {
            setName(response.data.userInfo.name);
            setUsername(response.data.userInfo.username);
            setBio(response.data.userInfo.bio);
            setAvatar(response.data.userInfo.pfpUrl);
            setLoading(false);
          }
        }).catch((err) => {
          console.error(err);
          setLoading(false);
        })
    }

    fetchProfile();
  }, []);

  if(loading){
    return <Loader />
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur-sm z-10 h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-black py-10 px-10 rounded-xl border border-white">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="relative space-y-6">
          {
            updateLoading && <Loader />
          }
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-medium">
                  Change
                </label>
                {
                  avatar !== null && (
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  )
                }
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            {
              name !== null && (
                <input
                  type="text"
                  id="name"
                  placeholder={name}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )
            }
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-500 text-sm">
                blip.com/
              </span>
              {
                username !== null && (
                  <input
                    type="text"
                    id="username"
                    placeholder={username}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )  
              }
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio
            </label>
            {
              bio !== null && (
                <textarea
                  id="bio"
                  placeholder={bio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              )
            }
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={cancel}
              type="button"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}