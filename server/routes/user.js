const router = require('express').Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const verify = require('../config/verify').verify;
const bcrypt = require('bcrypt');
const generateToken = require('../Utils/jwtToken');

router.get('/protected', verify, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, username: true, pfpUrl: true, id: true}
        });
        

        if(!user && userId) {
            return res.status(404).json({
                authenticated: false,
                message: 'Could not find user',
                status: 'failure'
            })
        }

        return res.status(200).json({
            authenticated: true,
            user: user
        })
    } catch(err) {
        console.log(err);   
    }
});

router.post('/signup', async (req, res) => {
    try {
        console.log('ran')
        const {name, username, email, password} = req.body;
        
        if(password) {
            var hashedPassword = await bcrypt.hash(password, 10);
        }

        const userExist = await prisma.user.findUnique({
            where: {email}
        });

        if(userExist) {
            console.log('user already exists')
            return res.status(409).json({message: 'User already exists', status: 'failure'})
        }

        const newUser = await prisma.user.create({
            data: {
                name, username, email, password: hashedPassword
            }
        });

        if(!newUser) {
            console.log('could not create user')
            return res.status(400).json({
                message: 'Could not create user',
                status: 'failure'
            })
        }

        res.status(201).json({
            message: 'User created',
            status: 'success'
        })

    } catch(err) {
        console.error("Sign Up Error: " + err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {email}
        });

        if(!existingUser) {
            return res.status(404).json({message: 'User not found', status: 'failed'})
        }

        const isValid = await bcrypt.compare(password, existingUser.password);

        if(!isValid) {
            return res.status(401).json({
                message: 'Incorrect Password',
                status: 'failure'
            })
        }

        const token = generateToken(existingUser);
        res.status(201).json({
            message: 'Login successful',
            status: 'success',
            token: token
        });

    } catch(err) {
        console.error("Log In Error: " + err);
        res.status(500).json({
            message: 'Internal Server Error: Could not log in',
            status: 'failure'
        })
    }
});

//get user information (for profile)
router.get('/', verify, async (req, res) => {
    try {
        const userId = req.user.id;

        const userInfo = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                name: true, username: true, email: true, bio: true, pfpUrl: true,
                followedBy: true, following: true, createdAt: true,
                lastLogin: true, updatedAt: true
            }
        });

        if(!userInfo){
            return res.status(404).json({
                message: 'User not found',
                status: 'failure'
            })
        }

        return res.status(200).json({
            message: 'Retreived user information successfuly',
            status: 'success',
            userInfo: userInfo
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error: Could not retreive user information',
            status: 'failure'
        })
    }
});

//change user's name
router.put('/update/name', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {newName} = req.body;

        const updateName = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: newName
            }
        });
        
        if(!updateName){
            return res.status(400).json({
                message: 'Update name failed',
                status: 'failure'
            })
        }

        return res.status(201).json({
            message: 'Updated name successfuly',
            status: 'success'
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error: Could not update name',
            status: 'failure'
        })
    }
});

//change user's bio
router.put('/update/bio', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {newBio} = req.body;

        const updateBio = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                bio: newBio
            }
        });
        
        if(!updateBio){
            return res.status(400).json({
                message: 'Update bio failed',
                status: 'failure'
            })
        }

        return res.status(201).json({
            message: 'Updated bio successfuly',
            status: 'success'
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error: Could not update bio',
            status: 'failure'
        })
    }
});

//change username
router.put('/update/username', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {newUsername} = req.body;

        const udpateUsername = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: newUsername
            }
        });
        
        if(!udpateUsername){
            return res.status(400).json({
                message: 'Update username failed',
                status: 'failure'
            })
        }

        return res.status(201).json({
            message: 'Updated username successfuly',
            status: 'success'
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error: Could not update username',
            status: 'failure'
        })
    }
});

//add following
router.post('/follow', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {followingId} = req.body;

        const followUser = await prisma.user.update({
            where: {id: userId},
            data: {
                following: {
                    connect: {
                        id: followingId
                    }
                }
            }
        });

        if(!followUser) {
            return res.status(400).json({
                message: 'Could not follow user',
                status: 'failure'
            })
        }

        const addFollower = await prisma.user.update({
            where: {id: followingId},
            data: {
                followedBy: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        if(!addFollower) {
            return res.status(400).json({
                message: 'Process failed',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Added follower successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//remove follower
router.put('/unfollow', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {followingId} = req.body;

        const unfollowUser = await prisma.user.update({
            where: {id: userId},
            data: {
                following: {
                    disconnect: {
                        id: followingId
                    }
                }
            }
        });

        if(!unfollowUser) {
            return res.status(400).json({
                message: 'Could not unfollow user',
                status: 'failure'
            })
        }

        const removeFollower = await prisma.user.update({
            where: {id: followingId},
            data: {
                followedBy: {
                    disconnect: {
                        id: userId
                    }
                }
            }
        });

        if(!removeFollower) {
            return res.status(400).json({
                message: 'Process failed',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Unfollowed user successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
})

//like a post
router.post('/like-post', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;

        const likePost = await prisma.user.update({
            where: {id: userId},
            data: {
                liked: {
                    connect: {
                        id: postId
                    }
                }
            }
        });

        if(!likePost) {
            return res.status(400).json({
                message: 'Could not like post',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Liked Post successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//unlike a post
router.post('/unlike-post', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;

        const unlikePost = await prisma.user.update({
            where: {id: userId},
            data: {
                liked: {
                    disconnect: {
                        id: postId
                    }
                }
            }
        });

        if(!unlikePost) {
            return res.status(400).json({
                message: 'Could not unlike post',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Unliked Post successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//bookmark a post
router.post('/bookmark-post', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;

        const bookmarkPost = await prisma.user.update({
            where: {id: userId},
            data: {
                bookmarked: {
                    connect: {
                        id: postId
                    }
                }
            }
        });

        if(!bookmarkPost) {
            return res.status(400).json({
                message: 'Could not bookmark post',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Bookmarked Post successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//repost
router.post('/repost', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;

        const repost = await prisma.user.update({
            where: {id: userId},
            data: {
                reposted: {
                    connect: {
                        id: postId
                    }
                }
            }
        });

        if(!repost) {
            return res.status(400).json({
                message: 'Could not repost',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Reposted successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//get users who registered the latest
router.get('/latest', verify, async (req, res) => {
    try {
        const latestUsers = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                username: true,
                pfpUrl: true
            },
            take: 10
        });

        if(!latestUsers)
            return res.status(400).json({message: 'Could not retrieve latest users', status: 'failure'})
        
        return res.status(200).json({message: 'Retreived latest users successfuly', status: 'success', latestUsers: latestUsers})

    } catch(err) {
        console.error(err);
    }
})

//get most followed users
router.get('/mostfollowed', verify, async (req, res) => {
    try {
        const mostFollowed = await prisma.user.findMany({
            take: 5,
            select: {
                id: true,
                name: true,
                username: true,
                _count: {
                    select: {
                        followedBy: true
                    }
                }
            },
            orderBy: {
                _count: {
                    followedBy: 'desc'
                }
            }
        });

        if(!mostFollowed)
            return res.status(400).json({message: 'Could not retrieve most followed users', status: 'failure'})
        
        return res.status(200).json({message: 'Retreived most followed users successfuly', status: 'success', mostFollowed: mostFollowed})

    } catch(err) {
        console.error(err);
    }
})

//serach for users
router.get('/search', verify, async (req, res) => {
    try {
        
        const {searchedUser} = req.query;
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: searchedUser,
                            mode: 'insensitive'
                        }
                    },
                    {
                        name: {
                            contains: searchedUser,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        if(!users)
            return res.status(400).json({message: 'Could not retrieve users', status: 'failure'})
        
        return res.status(200).json({message: 'Retreived users successfuly', status: 'success', users: users})

    } catch(err) {
        console.error(err);
    }
});

module.exports = router;