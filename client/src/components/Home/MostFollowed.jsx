import React, { useEffect } from 'react'
import users_api from '../../apis/user';

const MostFollowed = () => {

    const [mostFollowed, setMostFollowed] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMostFollowed = async () => {
            setLoading(true);
            await users_api.get('/mostfollowed', {
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
    <div className="hidden lg:block lg:w-[300px]">
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Who to Follow</h2>
              <div className="space-y-4">
                {mostFollowed.map((user, index) => (
                  <div key={index}>
                        <UserCard user={user}/>
                  </div>
                ))}
              </div>
            </div>
    </div>
  )
}

export default MostFollowed