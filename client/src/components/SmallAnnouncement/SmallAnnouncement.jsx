import React from 'react'
import './SmallAnnouncement.scss'

import { ImLocation2 } from 'react-icons/im';

const Announcement = ( { title } ) => {
  return (
    <div className='smallannouncement'>
      
      <div className="smallannouncement_image">
        <img src="https://blog-media.byjusfutureschool.com/bfs-blog/2022/08/03035002/Article-Image-945%C3%97498.jpg" alt="" />
      </div>
      
      <div className="smallannouncement_content">
        <h4>{title}</h4>

        <div className="smallannouncement_content-infos">
          <div className="smallannouncement_content-infos-profile">
            <img src="https://i.ibb.co/YZpLJ2y/Adil-Baltazare-Minimized.png" alt="" />
            <p>avec Adil</p>
          </div>

          <div className="smallannouncement_content-infos-address">
            <ImLocation2/>
            <p>La Courneuve</p>
          </div>
        </div>
      </div>

      <div className="smallannouncement_callToAction">
        {/* <button>Participer</button> */}
      </div>

    </div>
  )
}

export default Announcement