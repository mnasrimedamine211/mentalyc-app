import React, { useState, useEffect } from "react";
import './alerts.css'
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

  return visible ? (
    <div className={`alert alert-${type}`}>
      {message}
      <button className="close" onClick={() => onClose()}>
        &times;
      </button>
    </div>
  ) : null;
};
export default AlertMessageComponent;
