import React from 'react'
import { Outlet } from 'react-router'


const PrestadorPage = () => {
  
  return (
    <div className='prestadores'>
      <Outlet />
    </div>
  )
}

export default PrestadorPage