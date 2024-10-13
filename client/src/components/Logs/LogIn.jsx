import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../PopUps/Loader';
import users_api from '../../apis/user';
import { Context } from '../../context/ContextProvider';

const LogIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {setUserId} = useContext(Context);
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await users_api.post('/login', {
                email, password
            }).then(response => {
                setLoading(false);
                if(response.data.message === 'Login successful') {
                    localStorage.setItem("token", response.data.token);
                    navigate('/', {replace: true})
                }
            })
        } catch(err) {
            setLoading(false);
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
    
          {loading && <Loader />}

          <div className="w-full max-w-md relative z-10">
            <form className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white border-opacity-10" onSubmit={handleLogIn}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-white mb-2">Blip Login</h1>
                <p className="text-gray-400 text-sm">Welcome back to Blip! Please login to your account.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    className="w-full px-3 py-2 bg-black bg-opacity-50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    className="w-full px-3 py-2 bg-black bg-opacity-50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-white focus:ring-white border-gray-700 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-white hover:text-gray-300 transition duration-200">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Login
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link to={`/auth/signup`} className="text-white hover:text-gray-300 transition duration-200">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )
}

export default LogIn