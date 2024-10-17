import React, { useEffect, useState } from 'react'
import users_api from '../../apis/user';
import Loader from '../PopUps/Loader';
import UserCard from '../UserCard';

const MostFollowed = () => {

    const [mostFollowed, setMostFollowed] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMostFollowed = async () => {
            setLoading(true);
            await users_api.get('/most-followed', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setLoading(false);
                if(response.status === 200) {
                    setMostFollowed(response.data.mostFollowed);
                }
            })
        }   

        fetchMostFollowed();
    }, [])

  return (
    <div className="relative hidden lg:block lg:w-[300px]">
      {
        loading && <Loader />
      }
      <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Most Followed</h2>
        {
          mostFollowed && (
            <div className="space-y-4">
              {mostFollowed.map((user, index) => (
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

export default MostFollowed