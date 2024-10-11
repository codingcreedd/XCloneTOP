import React, { createContext, useState } from 'react'

export const Context = createContext(null);

const ContextProvider = ({children}) => {

    const [authState, setAuthState] = useState(false);
    const [signUp, setSignUp] = useState(false);

    const states = {
        authState, setAuthState,
        signUp, setSignUp
    }

  return (
    <Context.Provider value={states}>
        {children}
    </Context.Provider>
  )
}

export default ContextProvider