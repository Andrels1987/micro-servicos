import React from 'react'
import { Outlet } from 'react-router'

const HomePage = () => {
  return (
    <div className='home'>
        <Outlet />
    </div>
  )
}

export default HomePage