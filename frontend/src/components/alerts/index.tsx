import React, { useState, useEffect } from "react";
import "./alerts.css";
interface IProps {
  type: string;
  message: string;
  onClose: () => void;
}
const AlertMessageComponent = ({ type, message, onClose }: IProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);


    const getFillColor = () => {
      return type.toLocaleLowerCase().includes("success") ? "#5bb543" : "#e53935";
    };
  
  
    const getStrokeColor = () => {
      return "#FFF"; 
    };
  
    const getClassName = () => {
      return type.toLocaleLowerCase().includes("success") ? "ft-green-tick" : "ft-red-cross";
    };

  return visible ? (
    <div className={`alert alert-${type}`}>
     <div className="message-container">
      <div className="svg-container">
        <svg
          className={getClassName()}
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          width="30"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle className="circle" fill={getFillColor()} cx="24" cy="24" r="22" />
          {type.toLocaleLowerCase().includes("success") ? (
            <path
              className="tick"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M14 27l5.917 4.917L34 17"
            />
          ) : (
            <path
              className="cross"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M14 14l20 20M14 34L34 14"
            />
          )}
        </svg>
      </div>
      {message}
    </div>

      <button className="close" onClick={() => onClose()}>
        &times;
      </button>
    </div>
  ) : null;
};
export default AlertMessageComponent;
