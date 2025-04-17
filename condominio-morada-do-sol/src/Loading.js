import React from 'react'

const Loading = () => {
  return (
    <div data-testid="loading" className='loading'>
        <p>Carregando...</p>
        <div className="yellow ring"></div>
        <div className="green ring"></div>
        <div className="blue ring"></div>
    </div>
  )
}

export default Loading