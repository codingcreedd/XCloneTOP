import gsap from 'gsap';
import { useContext, useEffect, useState } from 'react';
import users_api from '../apis/user';
import Loader from './PopUps/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/ContextProvider';

const Post = ({post, postPage}) => {

    const token = localStorage.getItem("token");

    const {userId} = useContext(Context);

    const [bookmark, setBookmark] = useState(false);
    const [loading, setLoading] = useState(false);

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [reposted, setReposted] = useState(false);

    const [likes, setLikes] = useState(0);
    const [bookmarks, setBookmarks] = useState(0);
    const [reposts, setReposts] = useState(0);

    const navigate = useNavigate();

    const formatNumber = (number) => {
        if(number > 999) {
            return `${number / 1000}K`
        } else if(number > 999999) {
            return `${number / 1000000}M`
        }else {
            return number;
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
    
        const options = {
            year: 'numeric',
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true, 
        };
    
        return date.toLocaleString('en-US', options);
    };

    useEffect(() => {
        if (bookmark) {
            gsap.to('.bookmark', {
                color: "yellow",
                duration: 0.3,
                ease: "power1.inOut",
            });
    
            gsap.to('.bookmark', {
                scale: 1.4,
                duration: 0.3,
                ease: "power1.inOut",
                yoyo: true,
                repeat: 1,
            });
        } else {
            gsap.to('.bookmark', {
                color: "gray",
                duration: 0.3,
                ease: "power1.inOut",
            });
        }
    }, [bookmark]);

    useEffect(() => {

        setLikes(post?._count?.likedUsers);
        setReposts(post?._count?.repostedUsers);


        setLiked(post?.likedUsers?.some(user => user.id === userId));
        setBookmarked(post?.bookmarkUsers?.some(user => user.id === userId));
        setReposted(post?.repostedUsers?.some(user => user.id === userId));
    }, [post])
    

    const handleBookmark = async () => {
        try {
            await users_api.put('/bookmark-post', {postId: post.id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch(err) {
            console.error(err);
        }
    }

    const like = async () => {
        try {
            await users_api.put('/like-post', {postId: post.id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch(err) {
            console.error(err);
        }
    }

    const repost = async () => {
        try {
            setLoading(true);
            await users_api.put('/repost', {postId: post.id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                if(response.status === 201) {
                    setLoading(false);
                }
            })
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <div onClick={() => {navigate(`/post/${post?.id}`)}} key={post.id} className={`bg-white bg-opacity-5 cursor-pointer max-md:text-sm ${postPage ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-lg'} p-4 overflow-hidden backdrop-filter backdrop-blur-sm`}>
    {
        loading && <Loader />
    }
    <div className="flex items-start space-x-3">
        <img src={post?.user?.pfpUrl} alt={`${post?.user?.name?.charAt(0)}${post?.user?.name?.charAt(1)}`} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-semibold truncate">{post?.user?.name}</span>
                <Link to={`/${post?.user?.username}/profile`} className="text-gray-500 text-sm hover:underline cursor-pointer transition-all truncate" onClick={(e) => {e.stopPropagation()}}>@{post?.user.username}</Link>
                <span className="text-gray-500 text-sm whitespace-nowrap">· {formatDate(post?.createdAt)}</span>
            </div>
            <p className="mt-2 break-words whitespace-pre-wrap">{post.description}</p>
            {post?.imageurl && <img src={post.imageurl} className="mt-3 rounded-lg w-full" />}
            <div className="flex justify-between mt-4 flex-wrap">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span>{formatNumber(post._count.replies)}</span>
                </button>
                <button className={`flex items-center space-x-2 repost text-gray-500 hover:text-green-400`} onClick={(e) => {e.stopPropagation(); setReposted(true); setReposts(reposts => reposts + 1); repost()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${reposted && 'text-green-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>{formatNumber(reposts)}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 like hover:text-red-400" onClick={(e) => {e.stopPropagation(); setLiked(true);setLikes(likes => likes + 1); like()}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked && 'text-red-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{formatNumber(likes)}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-yellow-400 bookmark" onClick={(e) => {e.stopPropagation(); setBookmark(!bookmark); setBookmarked(true); handleBookmark();}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${bookmarked && 'text-yellow-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Post