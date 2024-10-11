import React, {useContext} from 'react'
import SignUp from './SignUp';
import LogIn from './LogIn';
import { Context } from '../../context/ContextProvider';
import { useParams } from 'react-router-dom';

const Logs = () => {

    const {logType} = useParams();

  return (
    <div>
        {
            logType === 'signup' ? (
                <SignUp />
            ) : (
                <LogIn />
            )
        }
    </div>
  )
}

export default Logs