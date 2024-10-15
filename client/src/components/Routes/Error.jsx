import { Link } from "react-router-dom"
export default function Error() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl font-bold mb-2">404</h1>
        <h2 className="text-3xl font-light mb-8">Page Not Found</h2>
        <p className="text-gray-400 mb-12 text-xl">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to={`/`} 
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition duration-300 text-lg"
        >
          Return Home
        </Link>
      </div>
      <footer className="absolute bottom-8 text-center text-gray-500">
        <p>&copy; 2024 Blip. All rights reserved.</p>
      </footer>
    </div>
  )
}