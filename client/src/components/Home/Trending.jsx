import React from 'react'

const Trending = () => {
  return (
    <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
              <ul className="space-y-2">
                {['#TechNews', '#GlobalEvents', '#HealthAndWellness', '#ArtAndCulture', '#ScienceAndNature'].map((topic) => (
                  <li key={topic} className="hover:text-blue-400 cursor-pointer">{topic}</li>
                ))}
              </ul>
            </div>
    </div>
  )
}

export default Trending