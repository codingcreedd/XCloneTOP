const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verify = require('../config/verify').verify;

// Create a post
router.post('/create', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, isReply, parentId } = req.body;
        console.log('ran create post')

        if (!description) {
            return res.status(400).json({
                message: 'Description is required',
                status: 'failure'
            });
        }

        let postData = {
            description,
            isReply: !!isReply,
            userId
        };

        if (isReply && parentId) {
            postData.parentId = parentId;
        }

        const post = await prisma.post.create({
            data: postData,
            include: {
                _count: {select: {likedUsers: true, bookmarkUsers: true, replies: true, repostedUsers: true}},
                user: true
            }
        });

        return res.status(201).json({
            message: 'Created post successfully',
            status: 'success',
            post
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot create post',
            status: 'failure'
        });
    }
});

//Delete a post
router.delete('/delete', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;
        //delete a post that belongs to this user and that has the following postId
        const deletePost = await prisma.post.delete({
            where: {
                AND: [
                    {id: postId},
                    {userId: userId}
                ]
            }
        });

        if(!deletePost) {
            return res.status(400).json({
                message: 'Could not delete post',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Deleted post successfuly',
            status: 'success'
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot delete post',
            status: 'failure'
        })
    }
})

//get posts of followings
router.get('/following-posts', verify, async (req, res) => {
    try {
        //Algorithm:
        //fetch posts which are not replies (reply is false)
        //posts should include their replies
        //fetch posts for users who has this user as a follower
        //limit results to 300
        const userId = req.user.id;
        const posts = await prisma.post.findMany({
            where: {
                AND: [
                    {isReply: false},
                    {
                        user: {
                            followedBy: {
                                some: {
                                    id: userId
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                replies: true,
                user: true,
                likedUsers: {
                    select: {
                        pfpUrl: true,
                        username: true
                    }
                },
                bookmarkUsers: {
                    select: {
                        pfpUrl: true,
                        username: true
                    }
                },
                repostedUsers: {
                    select: {
                        pfpUrl: true,
                        username: true
                    }
                },
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}}
            },
            take: 300,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if(!posts) {
            return res.status(400).json({
                message: 'Could not retreive posts',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Retreived posts successuly',
            status: 'success',
            posts: posts
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot retreive posts',
            status: 'failure'
        })
    }
});

//get user posts
router.get('/:user_id/posts', verify, async (req, res) => {
    try {
        const {user_id} = req.params;
        const posts = await prisma.post.findMany({
            where: {
                AND: [
                    {userId: Number(user_id)},
                    {isReply: false},
                ]
            },
            select: {
                id: true, description: true, user: true, replies: true, createdAt: true,
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}}
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if(!posts) {
            return res.status(400).json({
                message: 'Could not retreive posts',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Retreived posts successuly',
            status: 'success',
            posts: posts
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot retreive posts',
            status: 'failure'
        })
    }

});

//get user bookmarks
router.get('/:user_id/bookmarks', verify, async (req, res) => {
    try {
        const {user_id} = req.params;
        const bookmarks = await prisma.post.findMany({
            where: {
                bookmarkUsers: {
                    some: {id: Number(user_id)}
                }
            },
            select: {
                id: true, description: true, user: true, replies: true, createdAt: true,
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}}
            }
        })

        if(!bookmarks) {
            return res.status(400).json({
                message: 'Could not retreive bookmarks',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Retreived bookmarks successuly',
            status: 'success',
            posts: posts
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot retreive posts',
            status: 'failure'
        })
    }
});

//get user replies
router.get('/:user_id/replies', verify, async (req, res) => {
    try {
        const {user_id} = req.params;
        const replies_ = await prisma.post.findMany({
            where: {
                replies: {
                    some: {
                        userId: Number(user_id)
                    }
                }
            },
            select: {
                id: true, description: true, user: true, replies: true, createdAt: true,
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}},
                parentPost: true
            }, orderBy: {
                createdAt: 'desc'
            }
        })

        if(!replies_) {
            return res.status(400).json({
                message: 'Could not retreive replies',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Retreived replies successuly',
            status: 'success',
            replies: replies_
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot retreive posts',
            status: 'failure'
        })
    }
});

//get likes
router.get('/:user_id/likes', verify, async (req, res) => {
    try {
        const {user_id} = req.params;
        const likes = await prisma.post.findMany({
            where: {
                likedUsers: {
                    some: {
                        userId: Number(user_id)
                    }
                }
            },
            select: {
                id: true, description: true, user: true, replies: true, createdAt: true,
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}},
                parentPost: true
            }
        })

        if(!likes) {
            return res.status(400).json({
                message: 'Could not retreive liked posts',
                status: 'failure'
            });
        }

        return res.status(200).json({
            message: 'Retreived liked posts successuly',
            status: 'success',
            replies: likes
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot retreive posts',
            status: 'failure'
        })
    }
});

//search for post
router.get('/search', verify, async (req, res) => {
    try {
        const {searchedPost} = req.query;
        const posts = await prisma.post.findMany({
            where: {
                description: {
                    contains: searchedPost
                }
            },
            select: {
                id: true, description: true, user: true, replies: true, createdAt: true,
                _count: {select: {bookmarkUsers: true, replies: true, likedUsers: true, repostedUsers: true}},
                parentPost: true
            }
        });

        if(!posts)
            return res.status(400).json({message: 'Could not retrieve posts', status: 'failure'})
        
        return res.status(200).json({message: 'Retreived posts successfuly', status: 'success', posts: posts})

    } catch(err) {
        console.error(err);
    }
});



module.exports = router;
