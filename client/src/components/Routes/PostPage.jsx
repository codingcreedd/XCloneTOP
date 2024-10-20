import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import posts_api from "../../apis/post";
import Post from "../Post";
import Loader from "../PopUps/Loader";
import CreatePost from "../Home/CreatePost";

export default function PostPage() {

    const [post, setPost] = useState(null)
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const {post_id} = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            await posts_api.get(`/single-post/${post_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if(response.status === 200){
                    setPost(response.data.post);
                    setReplies(response.data.post.replies);
                }

                setLoading(false);
            })
        }

        fetchPost();
    }, [post_id])

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm border-b border-white border-opacity-10 z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button onClick={() => window.history.back()} className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <span className="text-xl font-bold">Post</span>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Main Content */}
        <main className="relative pt-20 pb-8 max-w-2xl mx-auto px-4">
            {
                loading && <Loader />
            }
            {/* Original Post */}
            {
                post !== null && <Post post={post} postPage={true}/>
            }
  
          {/* Reply Section */}
          {
            post !== null && <CreatePost isReply={true} message={`Post your reply`} parentId={post?.id} replies={replies} setReplies={setReplies}/>
          }
  
          {/* Replies */}
          {
            post && (
                <div className="space-y-4">
                    {replies?.map((reply) => (
                    <Post key={reply.id} post={reply}/>
                    ))}
                </div>
            )
          }
        </main>
      </div>
    )
  }