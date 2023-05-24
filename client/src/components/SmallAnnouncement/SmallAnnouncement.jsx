import React from 'react'
import './Announcement.scss'

import { ImLocation2 } from 'react-icons/im';

const SmallAnnouncement = ( { titre, image, lieu, prof, onClick } ) => {
  return (
    <div className='smallannouncement' onClick={onClick}>
      
      <div className="smallannouncement_image">
        <img src={image} alt="" />
      </div>
      
      <div className="smallannouncement_content">
        <h4>{titre}</h4>

        <div className="smallannouncement_content-infos">
          <div className="smallannouncement_content-infos-profile">
            <img src={prof.Image} alt={prof.Nom} />
            <p>avec {prof.Nom}</p>
          </div>

          <div className="smallannouncement_content-infos-address">
            <ImLocation2/>
            <p>{lieu}</p>
          </div>
        </div>
      </div>

      <div className="smallannouncement_callToAction">
        {/* <button>Participer</button> */}
      </div>

    </div>
  )
}

export default SmallAnnouncement