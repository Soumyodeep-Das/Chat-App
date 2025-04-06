import React from 'react';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avtar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const isOnline = onlineUser?.includes(userId);

  let avtarName = "";

  if (name) {
    const splitName = name.trim().split(" ");
    avtarName = splitName.length > 1
      ? splitName[0][0] + splitName[1][0]
      : splitName[0][0];
  }

  const bgColor = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark',
    'bg-primary-subtle', 'bg-secondary-subtle', 'bg-success-subtle', 'bg-danger-subtle',
    'bg-warning-subtle', 'bg-info-subtle', 'bg-dark-subtle',
    'bg-body-tertiary', 'bg-body-secondary'
  ];

  const randomColor = bgColor[Math.floor(Math.random() * bgColor.length)];

  return (
    <div
      className="text-dark rounded-circle fw-bold position-relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="rounded-circle overflow-hidden"
        />
      ) : name ? (
        <div
          className={`rounded-circle overflow-hidden fs-3 d-flex justify-content-center align-items-center ${randomColor}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {avtarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div
          className="bg-success rounded-circle"
          style={{
            position: "absolute",
            bottom: "2px",
            right: "0px",
            width: "10px",
            height: "10px"
          }}
        ></div>
      )}
    </div>
  );
};

export default Avtar;
