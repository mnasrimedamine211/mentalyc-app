import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import VideoComponent from "../../components/video";
import { Skeleton, Box } from "@mui/material";
import axios from "axios";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const videoWidth = videoRef.current.clientWidth;
      const emptyVideos = document.querySelectorAll(".empty-videos");
      emptyVideos.forEach((emptyVideo) => {
        (emptyVideo as HTMLDivElement).style.width = `${videoWidth}px`;
      });
    }
  }, [videos]);
  // first Render of page
  useEffect(() => {
    axios
      .get("http://localhost:3006/videos")
      .then((response) => {
        if (response) {
          let data = response.data.videos;

          setVideos(data);
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  //Renders empty video placeholders to maintain layout consistency
  const empty_videos = () => {
    return (
      videos &&
      Array.from(new Array(6)).map((item, index) => (
        <div key={index} className="empty-videos"></div>
      ))
    );
  };

  const render_skelton = () => {
    return (
      <div className="home-container">
        {loading &&
          Array.from(new Array(6)).map((element, index) => (
            <div key={index} className="empty-videos">
              <Skeleton variant="rectangular" width={350} height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="home">
      {loading ? (
        <div>{render_skelton()}</div>
      ) : !videos.length ? (
        <div className="no-data">
          <h1>No data available</h1>
        </div>
      ) : (
        <div className="home-container">
          {videos &&
            videos.map((video: string, index: number) => (
              <div key={index} id="video" ref={videoRef}>
                <VideoComponent videoItem={video} />
              </div>
            ))}
          {empty_videos()}
        </div>
      )}
    </div>
  );
}
export default Home;
