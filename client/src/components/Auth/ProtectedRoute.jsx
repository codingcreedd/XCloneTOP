import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import users_api from '../../apis/user';
import Loader from '../PopUps/Loader';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { authState, setAuthState, setUserId, setUser } = useContext(Context);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
            try {
                setLoading(true);
                await users_api.get('/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(response => {
                    setUser(response.data.user)
                    setAuthState(response.data.authenticated);
                    setUserId(response.data.user.id);
                    console.log(response.data.user.id + ' ' + response.data.authenticated)
                })
            } catch (error) {
                console.error('Error during authentication', error);
                setAuthState(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            auth();
        } else {
            setAuthState(false);
            setLoading(false);
        }
    }, [token, setAuthState]);

    if (loading) {
        return (
            <div className="relative">
                {children}
                
                <div className="absolute">
                    <Loader /> 
                </div>
            </div>
        );
    }

    return authState ? children : navigate('/auth/login', { replace: true });
};

export default ProtectedRoute;
