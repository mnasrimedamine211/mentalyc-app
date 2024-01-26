import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import "./header.css";

import { useNavigate, useLocation  } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function Header() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToAddVideo = () => {
    navigate("/addVideo");
  };

  return (
    <div className="header" id="header">
      <div className="badge" onClick={navigateToHome}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            src="/static/icon/mentalyc_logo.svg"
            style={{ cursor: "pointer" }}
          />
        </StyledBadge>
        <h3 className="title"> Mentalyc</h3>
      </div>
      <div className="header-action">
        <button className={location.pathname !== '/' ? "add-button" :'active-button'} onClick={navigateToHome}>
          <i className="fas fa-arrow-left icons"></i>
          <span className={windowWidth > 767 ? "" : "close-add-button"}>
            Home
          </span>
        </button>
        <button className={location.pathname !== '/addVideo' ? "add-button" :'active-button'} onClick={navigateToAddVideo}>
          <i className="fas fa-plus icons"></i>
          <span className={windowWidth > 767 ? "" : "close-add-button"}>
            Add video
          </span>
        </button>
      </div>
    </div>
  );
}
export default Header;
