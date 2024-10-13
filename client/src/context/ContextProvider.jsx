import React, { createContext, useState } from 'react'

export const Context = createContext(null);

const ContextProvider = ({children}) => {

    const [authState, setAuthState] = useState(false);
    const [userId, setUserId] = useState(0);
    const [user, setUser] = useState({});
    const [forYou, setForYou] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);

    const states = {
        authState, setAuthState,
        userId, setUserId,
        user, setUser,
        forYou, setForYou,
        followingPosts, setFollowingPosts
    }

  return (
    <Context.Provider value={states}>
        {children}
    </Context.Provider>
  )
}

export default ContextProvider