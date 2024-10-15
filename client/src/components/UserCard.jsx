import React, { useContext, useEffect, useState } from 'react';
import FollowButton from './FollowButton';
import { Context } from '../context/ContextProvider';
import MessageButton from './MessageButton';
import users_api from '../apis/user';
import Loader from './PopUps/Loader';

const UserCard = ({ user, onExplore }) => {
    const { userId } = useContext(Context);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        setIsFollowing(user?.followedBy?.some(follower => follower?.id === userId));
    }, [user, userId]);

    const follow = async () => {
        const followingId = user.id;
        setLoading(true);
        try {
            if (!isFollowing) {
                await users_api.post(
                    '/follow',
                    { followingId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then(() => {
                  setIsFollowing(true);
                  setLoading(false);
                })
            } else {
                await users_api.put(
                    '/unfollow',
                    { followingId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then(response => {
                  if (response.status === 201) {
                      setIsFollowing(false);
                  }

                  setLoading(false);
                })
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div key={user?.id} className="flex items-center justify-between w-full">
          {
            loading && <Loader />
          }
            <div className="flex items-center space-x-3">
                <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-gray-500 text-sm">@{user?.username}</div>
                </div>
            </div>
            <div className="flex gap-5 items-center">
                {user?.id !== userId && (
                    <FollowButton
                        userId={user?.id}
                        onClick_={follow}
                        isFollowing={isFollowing}
                    />
                )}
                {onExplore && <MessageButton userId={user?.id} />}
            </div>
        </div>
    );
};

export default UserCard;
