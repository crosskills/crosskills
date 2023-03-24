import React from 'react'

import LoadingImg from "../../assets/images/loader.png";

const Loader = () => {
  return (
      <img src={LoadingImg} alt="" className='max-w-[70px] rotate p-5' />
  )
}

export default Loader