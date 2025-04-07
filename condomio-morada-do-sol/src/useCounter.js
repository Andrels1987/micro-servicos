import React, { useState } from 'react'

const useCounter = ({initialCounter = 0} = {}) => {
   const [counter, setCounter] =  useState(initialCounter)
   const increment = () => {setCounter(old => old + 1)}
   const decrement = () => {setCounter(old => old - 1)}
    return {counter, increment, decrement}
}



export default useCounter;