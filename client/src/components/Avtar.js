import React from 'react'
import { PiUserCircle } from "react-icons/pi";

//Name : Ankana Saha
// Icon : AS

const Avtar = ({userId,name,imageUrl,width,height}) => {

    let avtarName = "";

    if(name){
        const splitName = name?.split(" ");

        if(splitName.length > 1){
            avtarName = splitName[0][0] + splitName[1][0];
        }else{
            avtarName = splitName[0][0];
        }
    }

    const bgColor = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark',
    'bg-primary-subtle', 'bg-secondary-subtle', 'bg-success-subtle', 'bg-danger-subtle', 'bg-warning-subtle', 'bg-info-subtle', 'bg-dark-subtle',
    'bg-body-tertiary', 'bg-body-secondary',  'bg-danger-subtle', 'bg-success-subtle', 'bg-warning-subtle'
    ];



    const randomNumber = Math.floor(Math.random() * bgColor.length);

  return (
    <div className={`text-dark overflow-hidden rounded-circle fw-bold `} style={{width : width+"px", height : height+"px" }}>
      {
        imageUrl ?(
            <img src={imageUrl} width={width} height={height} alt={name} className='rounded-circle overflow-hidden'  />
        ):(
            name ? (
                <div 
                    className={`rounded-circle overflow-hidden fs-3 d-flex justify-content-center align-items-center ${bgColor[randomNumber]}`}
                    style={{width : width+"px", height : height+"px" }}

                >
                    {avtarName}
                </div>
            ):(
                <PiUserCircle 
                    size={width}
                />
            )
        )
      }
    </div>
  )
}

export default Avtar
