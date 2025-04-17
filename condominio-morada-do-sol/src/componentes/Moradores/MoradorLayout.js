import React from 'react'
import { Outlet } from 'react-router'

const MoradorLayout = () => {
  return (
    <div className='moradores'>
        <Outlet />
    </div>
  )
}

export default MoradorLayout