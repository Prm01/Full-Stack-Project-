import React from 'react'
import Header from '../Components/Header'
import SpecialityMenu from '../Components/SpecialityMenu'
import TopDoctor from '../Components/TopDoctor'
import Banner from '../Components/banner'

const home = () => {
  return (
    <div>
    <Header></Header>
    <SpecialityMenu></SpecialityMenu>
    <TopDoctor></TopDoctor>
    <Banner></Banner>
    </div>
  )
}

export default home
