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
        const time = match[1];
        const date = time ? new Date(parseInt(time)) : new Date();
        var day = date.toLocaleString("en-us", { weekday: "short" });
        var month = date.toLocaleString("en-us", { month: "short" });
        var dayOfMonth = date.getDate();
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        var formattedDate = `${day} ${month} ${dayOfMonth} ${year} ${hours}:${minutes}`;

        const title = match[2];
        setTitle(title);
        setDateOfCreation(formattedDate.toString());
      }
    }
  }, []);

  const handleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const duration = (event.target as HTMLVideoElement).duration;
    console.log(
      duration,
      Number.isFinite(duration),
      duration,
      !isNaN(duration)
    );
    let timeOfVideo = "";
    if (Number.isFinite(duration) && duration && !isNaN(duration)) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      timeOfVideo = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    setVideoDuration(timeOfVideo);
  };
  return (
    <div className="video">
      <Box
        key={videoItem}
        sx={{ width: 400, height: 300, position: "relative" }}
      >
        <button className="time"> {videoDuration}</button>

        <video
          controls
          className="video-content"
          onLoadedMetadata={handleLoadedMetadata}
          id="video-play"
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
