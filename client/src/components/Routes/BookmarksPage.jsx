import { useState, useEffect, useContext } from 'react'
import posts_api from '../../apis/post';
import { Context } from '../../context/ContextProvider';
import Loader from '../PopUps/Loader';
import Nav from '../Home/Nav';
import Post from '../Post';

export default function Bookmarks() {
  const [activeTab, setActiveTab] = useState('all')
  const [columns, setColumns] = useState(3);
  const [bookmarks, setBookmarks] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const {userId} = useContext(Context);

  useEffect(() => {
    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            await posts_api.get(`/${userId}/bookmarks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if(response.status === 200) {
                    setLoading(false);
                    console.log(response.data.bookmarks)
                    setBookmarks(response.data.bookmarks);
                }
            })
        } catch(err) {
            console.error(err);
        }
    }

    fetchBookmarks();
  }, [])

  return (
    <div className="min-h-screen bg-black text-white sm:p-8">
        <Nav />
      <div className="max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center">Bookmarks</h1>
        <div className='relative px-20 border border-white rounded-lg py-10'>
            {
                loading && <Loader />
            }
            {
                bookmarks && bookmarks.length > 0 ? (
                    <div className='flex flex-col gap-10'>
                        {
                            bookmarks?.map(bookmark => (
                                <Post post={bookmark} key={bookmark.id} />
                            ))
                        }
                    </div>
                ) : (
                    <p>You have no bookmarks</p>
                )
            }
        </div>
      </div>
    </div>
  )
}