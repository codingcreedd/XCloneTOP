import React from 'react'
import Post from '../Post'

const ProfileList = ({posts}) => {

    if(posts.length === 0) {
        return <p className='font-bold text-sm'>Nothing to see here</p>
    }

  return (
    <div className="space-y-4">
        {posts.map((post) => (
            <Post post={post} key={post.id} />
        ))}
    </div>
  )
}

export default ProfileList