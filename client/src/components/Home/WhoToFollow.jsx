import React, { useEffect, useState } from 'react'
import UserCard from '../UserCard'
import users_api from '../../apis/user';
import Loader from '../PopUps/Loader';

const WhoToFollow = () => {

  const [whoToFollow, setWhoToFollow] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
      const fetchWhoToFollow = async () => {
        setLoading(true);
        await users_api.get('/who-to-follow', {
          headers: {Authorization: `Bearer ${token}`}
        }).then(response => {
          if(response.status === 200){
            setLoading(false);
            setWhoToFollow(response.data.users);
          }
        })
      }

      fetchWhoToFollow();
  }, [])

  return (
    <div className="relative hidden lg:block lg:w-[300px]">
      {
        loading && <Loader />
      }
      <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
        {
          whoToFollow && (
            <div className="space-y-4">
              {whoToFollow.map((user, index) => (
                <div key={index}>
                      <UserCard user={user}/>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default WhoToFollow