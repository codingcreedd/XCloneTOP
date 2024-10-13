import React, { useEffect, useState } from 'react'
import UserCard from '../UserCard'
import users_api from '../../apis/user';

const WhoToFollow = () => {

  const [whoToFollow, setWhoToFollow] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //     const fetchWhoToFollow = async () => {
  //       await users_api.get('/')
  //     }

  //     fetchWhoToFollow();
  // }, [])

  return (
    <div className="hidden lg:block lg:w-[300px]">
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((user, index) => (
                  <div key={index}>
                        <UserCard user={user}/>
                  </div>
                ))}
              </div>
            </div>
    </div>
  )
}

export default WhoToFollow