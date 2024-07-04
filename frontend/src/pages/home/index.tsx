import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  let navigate=useNavigate()
  useEffect(()=>{
    navigate("/login")
  })
  return (
    <section>
      home
    </section>
  )
}

export default Home
