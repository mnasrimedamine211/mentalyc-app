import React, { ChangeEvent, useState } from "react";
import { Grid, TextField } from "@mui/material";

import "./addVideo.css";
import VideoUploadComponent from "../../components/video-upload";

const AddVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleError("");
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
    setDescriptionError("");
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Validate inputs
    /* if (!videoFile) {
      setVideoError("Please upload a video file.");
    } */

    if (!title.trim()) {
      setTitleError("Please enter a title.");
    }

    if (!description.trim()) {
      setDescriptionError("Please enter a description.");
    }

    if (title.trim() && description.trim()) {
     // console.log("Video File:", videoFile);
      console.log("Title:", title);
      console.log("Description:", description);
    }
  };

  return (
    <div id="addVideo" className="addVideo">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
           <VideoUploadComponent />
          </Grid>
    
         {/*  <Grid
            item
            xs={12}
            md={6}
            container
            direction="column"
            style={{ margin: "auto 0" }}
          >
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={handleTitleChange}
              error={!!titleError}
              helperText={titleError}
              style={{ marginBottom: "30px" }}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              error={!!descriptionError}
              helperText={descriptionError}
            />
          </Grid> */}
        </Grid> 

        <button className="add-button" type="submit">
          <i className="fas fa-plus icons"></i>
          <span>Add video</span>
        </button>
      </form>
    </div>
  );
};

export default AddVideo;
