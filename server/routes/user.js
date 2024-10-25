const router = require('express').Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const verify = require('../config/verify').verify;
const bcrypt = require('bcrypt');
const generateToken = require('../Utils/jwtToken');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

const numberRegex = /\d/;
const uppercaseRegex = /[A-Z]/;
const specialCharacterRegex = /[@$!%*?&]/;

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
                status: 'failure',
                user: null
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
        const {name, username, email, password} = req.body;

        let messages = [];
        
        if (!password) {
            messages.push(`Password is required`);
        } else {
            if (password.length < 8) {
                messages.push(`Password must be at least 8 characters long`);
            }
            if (!numberRegex.test(password)) {
                messages.push(`Password must contain at least one number`);
            }
            if (!uppercaseRegex.test(password)) {
                messages.push(`Password must contain at least one uppercase letter`);
            }
            if (!specialCharacterRegex.test(password)) {
                messages.push(`Password must contain at least one special character`);
            }
        }

        if (messages.length > 0) {
            return res.status(400).json({
                message: messages[0], 
                status: 'failure',
                errors: messages
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userExist = await prisma.user.findUnique({
            where: {email}
        });

        if(userExist) {
            console.log('User  already exists');
            return res.status(409).json({message: 'User  already exists', status: 'failure'});
        }

        const newUser  = await prisma.user.create({
            data: {
                name, username, email, password: hashedPassword
            }
        });

        if (!newUser ) {
            console.log('Could not create user');
            return res.status(400).json({
                message: 'Could not create user',
                status: 'failure'
            });
        }

        res.status(201).json({
            message: 'User  created',
            status: 'success'
        });

    } catch (err) {
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
router.get('/:username/profile', verify, async (req, res) => {
    try {
        const {username} = req.params;

        const userInfo = await prisma.user.findUnique({
            where: {username},
            select: {
                id:true, name: true, username: true, email: true, bio: true, pfpUrl: true,
                followedBy: {
                    orderBy: {
                        id: 'asc'
                    }
                }, following: true, createdAt: true,
                lastLogin: true, updatedAt: true, posts: true
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

//get user information for edit profile
router.get('/edit-profile-info', verify, async (req, res) => {
    try {
        const userId = req.user.id;

        const userInfo = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id:true, name: true, username: true, bio: true, pfpUrl: true
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
})

router.put('/update-user-info', verify, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.id;
        const {newName, newUsername, newBio} = req.body;

        const file = req.file;

        if(file) {
            const formData = new FormData();
            formData.append("image", file.buffer.toString("base64"));

            //upload to imageBB
            const imageBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
                method: "POST",
                body: formData
            });

            const result = await imageBBResponse.json();

            if(result && result.data){
                let pfpUrl = result.data.url;
                const updatePfp = await prisma.user.update({
                    where: {id: userId},
                    data: {
                        pfpUrl
                    }
                });

                if(!updatePfp){
                    return res.status(400).json({
                        message: 'Update profile picture failed',
                        status: 'failure'
                    })
                }
            }

        }


        if(newName !== null) {
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
        }
        
        if(newUsername !== null) {
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
        }

        if(newBio !== null) {
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
        }

        return res.status(201).json({
            message: 'Updated info successfuly',
            status: 'success'
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error: Could not update name',
            status: 'failure'
        })
    }
})

//add following 
router.post('/follow', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { followingId } = req.body;

        const [followUser, addFollower, createChat] = await Promise.all([
            prisma.user.update({
                where: { id: userId },
                data: {
                    following: {
                        connect: {
                            id: followingId
                        }
                    }
                }
            }),

            prisma.user.update({
                where: { id: followingId },
                data: {
                    followedBy: {
                        connect: {
                            id: userId
                        }
                    }
                }
            }),

            prisma.chat.create({
                data: {
                    users: {
                        connect: [
                            { id: userId }, 
                            { id: followingId }
                        ]
                    }
                }
            })
        ]);

        if (!followUser || !addFollower || !createChat) {
            return res.status(400).json({
                message: 'Process failed',
                status: 'failure'
            });
        }

        return res.status(201).json({ 
            message: 'Added follower successfully', 
            status: 'success' 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure'
        });
    }
});

//remove follower
router.put('/unfollow', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { followingId } = req.body;

        const [unfollowUser, removeFollower, deleteChat] = await Promise.all([
            prisma.user.update({
                where: { id: userId },
                data: {
                    following: {
                        disconnect: {
                            id: followingId
                        }
                    }
                }
            }),

            prisma.user.update({
                where: { id: followingId },
                data: {
                    followedBy: {
                        disconnect: {
                            id: userId
                        }
                    }
                }
            }),

            prisma.chat.delete({
                where: {
                    users: {
                        some: [
                            {id: userId},
                            {id: followingId}
                        ]
                    }
                }
            })
        ]);

        if (!unfollowUser || !removeFollower || !deleteChat) {
            return res.status(400).json({
                message: 'Process failed',
                status: 'failure'
            });
        }

        return res.status(201).json({
            message: 'Unfollowed user successfully',
            status: 'success'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'failure'
        });
    }
});

//like a post
router.put('/like-post', verify, async (req, res) => {
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

//remove like
router.put('/unlike-post', verify, async (req, res) => {
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
router.put('/bookmark-post', verify, async (req, res) => {
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

//remove bookmark
router.put('/remove-bookmark', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.body;

        const removeBookmark = await prisma.user.update({
            where: {id: userId},
            data: {
                bookmarked: {
                    disconnect: {
                        id: postId
                    }
                }
            }
        });

        if(!removeBookmark) {
            return res.status(400).json({
                message: 'Could not remove bookmark',
                status: 'failure'
            })
        }

        return res.status(201).json({message: 'Removed bookmark successfuly', status: 'success'})

    } catch(err) {
        console.error(err);
    }
});

//repost
router.put('/repost', verify, async (req, res) => {
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
                pfpUrl: true,
                followedBy: {
                    select: {id: true}
                }
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
router.get('/most-followed', verify, async (req, res) => {
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
                },
                followedBy: true
            },
            orderBy: {
                followedBy: {
                    _count: 'desc'
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
            },
            include: {
                followedBy: {
                    select: {id: true}
                }
            }
        });

        if(!users)
            return res.status(400).json({message: 'Could not retrieve users', status: 'failure'})
        
        return res.status(200).json({message: 'Retreived users successfuly', status: 'success', users: users})

    } catch(err) {
        console.error(err);
    }
});

router.get('/who-to-follow', verify, async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await prisma.user.findMany({
            where: { id: userId },
            select: {
                following: {
                    select: {
                        following: {
                            where: {
                                followedBy: {
                                    none: {id: userId}
                                }
                            },
                            take: 3,
                            orderBy: {
                                followedBy: {
                                    _count: 'desc'
                                }
                            },
                            select: {
                                pfpUrl: true, 
                                username: true, 
                                name: true, 
                                id: true,
                                _count: {
                                    select: { followedBy: true }
                                }
                            }
                        }
                    }
                }
            }
        });
        

        console.log(users[0].following);
        if(!users) 
            return res.status(400).json({message: 'Cannot retreive users', status: 'failure'});

        const whotofollow = [];
        users[0].following.forEach(following => {
            const newArrayOfFollowings = [...following.following];

            newArrayOfFollowings.forEach(following_ => {
                const exists = whotofollow.some(user => user.id === following_.id);
                if(!exists && following_.id !== userId)
                    whotofollow.push(following_);
            })
        });


         
        return res.status(200).json({message: 'Retreived users successfuly', status: 'success', users: whotofollow})

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: 'Internal Server Error: Cannot retreive users', status: 'failure'});
    }
})

//get list of users which you have more than one message with
router.get('/message-users', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                chats: {
                    some: {
                        users: {
                            some: {id: userId}
                        },
                        messages: {
                            some: {}
                        }
                    },
                }
            },
            select: {
                id: true, pfpUrl: true, name: true, username: true, bio: true
            }
        });

        if(!users)
            return res.status(400).json({message: 'Could not retreive users', status: 'failure'});

        return res.status(200).json({
            message: 'Retreived users successfully',
            status: 'success',
            users
        })


    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Could not retreive users',
            status: 'failure'
        })
    }
})

//-----------------------------------------------------------------------------------------------------------------------//

//get chat between 2 users
router.get('/chat/:user_id', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {user_id} = req.params;
        const chat = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        id: {
                            in: [userId, Number(user_id)]
                        }
                    }
                }
            },
            include: {
                messages: {
                    include: {
                        User: true
                    }
                },
                users: true
            }
        });

        if(!chat)
            return res.status(400).json({message: 'Could not retreive chat', status: 'failure'});

        return res.status(200).json({
            message: 'Retreived chat successfully',
            status: 'success',
            chat,
            clientId: userId
        })


    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Could not retreive users',
            status: 'failure'
        })
    }
});


module.exports = router;