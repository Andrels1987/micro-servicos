import React from 'react'
import { Link } from 'react-router-dom'

const BtnAdicionar = ({link}) => {
  return (
    <div>
        <Link to={link}>+</Link>
    </div>
  )
}

export default BtnAdicionar