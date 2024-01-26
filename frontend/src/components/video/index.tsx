import React, { useEffect, useState } from "react";
import "./video.css";
import { VideoType } from "../../utils/interfaces/interfaces";
import { Box, Typography } from "@mui/material";
interface IProps {
  videoItem: string;
}
export default function VideoComponent({ videoItem }: IProps) {
  const apiUrl = "http://localhost:3006/uploads/";
  const [videoDuration, setVideoDuration] = useState("");
  const [title, setTitle] = useState("");
  const [dataOfCreation, setDateOfCreation] = useState("");

  useEffect(() => {
    if (videoItem) {
      const match = videoItem.match(/^(\d+)-(.+)\.mp4$/);
      
      if (match) {
        const time = match[1]
        const date =time ?  new Date(parseInt(time)) : new Date()
        const title = match[2];
        setTitle(title);
        setDateOfCreation(date.toString());
      }
    }
  }, []);

  const handlePlay = () => {
    const videoElement = document.getElementById('video-play') as HTMLVideoElement;

    if (videoElement) {
      const duration = videoElement.duration;

      if (!isNaN(duration)) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        setVideoDuration(formattedDuration);
      }
    }
  };
  return (
    <div className="video">
      <button className="time"> {videoDuration}</button>
      <Box key={videoItem} sx={{ width: 350, height: 250 }}>
        <video
          controls
          className="video-content"
          onPlay={handlePlay}
          id='video-play'

        >
          <source src={apiUrl + videoItem} type="video/mp4" />
        </video>
        <Box sx={{ pr: 2 }}>
          <Typography gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography display="block" variant="caption" color="text.secondary">
            {dataOfCreation}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
