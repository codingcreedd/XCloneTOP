import React, { useEffect, useState } from 'react'
import users_api from '../../apis/user';
import UserCard from '../UserCard';
import Loader from '../PopUps/Loader';

const LatestUsers = () => {

    const [latestUsers, setLatestUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchLatest = async () => {
            setLoading(true);
            await users_api.get('/latest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setLoading(false);
                console.log(response.data.latestUsers)
                if(response.status === 200) {
                    setLatestUsers(response.data.latestUsers);
                }
            })
        }

        fetchLatest();
    }, [])
    
    if(loading) {
      return <Loader />
    }

  return (
    <div className="relative hidden lg:block lg:w-[300px]">
        {
            loading && <Loader />
        }
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Latest Users</h2>
              <div className="space-y-4">
                {latestUsers.map((user, index) => (
                  <div key={user.id}>
                        <UserCard user={user}/>
                  </div>
                ))}
              </div>
            </div>
    </div>
  )
}

export default LatestUsers