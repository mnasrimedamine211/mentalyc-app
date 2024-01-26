import React, { ChangeEvent, useState } from "react";
import "./addVideo.css";
import VideoUploadComponent from "../../components/video-upload";

const AddVideo = () => {
  return (
    <div id="addVideo" className="addVideo">
      <VideoUploadComponent />
    </div>
  );
};

export default AddVideo;
