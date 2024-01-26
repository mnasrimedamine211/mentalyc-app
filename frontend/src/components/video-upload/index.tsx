import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./videoUpload.css";
import axios from "axios";
import AlertMessageComponent from "../alerts";

function VideoUploadComponent() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoError, setVideoError] = useState("");
  const [startRecord, setStartRecord] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [openAlert, setOpenAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const showAlertComponent = (type: string, message: string) => {
    setOpenAlert({ type, message });
  };

  const closeAlertComponent = () => {
    setOpenAlert(null);
  };
  const handleDataAvailable = useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);

    const webcam: any = webcamRef.current;
    if (webcam) {
      const stream = webcam.stream;
      if (stream) {
        //@ts-ignore
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });
        //@ts-ignore
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        //@ts-ignore
        mediaRecorderRef.current.start();

        const maxRecordingTime = 60 * 60 * 1000;
        let elapsedTime = 0;

        const intervalId = setInterval(() => {
          elapsedTime += 1000;
          if (elapsedTime >= maxRecordingTime) {
            clearInterval(intervalId);
            handleStopCaptureClick();
          }
        }, 1000);
      } else {
        setCapturing(false);
        setVideoError("Webcam stream not available.");
      }
    } else {
      setCapturing(false);
      setVideoError("Webcam reference not available.");
    }
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    const mediaRecorder: any = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setCapturing(false);
    } else {
      setVideoError("MediaRecorder reference not available.");
    }
  }, [mediaRecorderRef, setCapturing]);

  const handleUpload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const randomNum = Math.floor(Math.random() * 1000) + 1;
      const videoName = `video(${randomNum}).mp4`;
      const formData = new FormData();
      formData.append("file", blob, videoName);
      let alertMessage = null;
      axios
        .post("http://localhost:3006/upload", formData)
        .then((response) => {
          if (response && response.data) {
            alertMessage = {
              type: "success",
              message: "Operation successful",
            };
            showAlertComponent(alertMessage.type, alertMessage.message);
          }
        })
        .catch((error) => {
          alertMessage = {
            type: "error",
            message: "Operation successful",
          };
          showAlertComponent(alertMessage.type, alertMessage.message);
        });
      /*    const url = URL.createObjectURL(blob);
      const a: any = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = videoName;
      a.click();
      window.URL.revokeObjectURL(url); */
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user",
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.endsWith("mp4")) {
        setVideoFile(file);
        const selectVideo = URL.createObjectURL(file);
        setVideoUrl(selectVideo);

        setVideoError("");
      } else {
        setVideoError("Please upload a valid video file.");
      }
    }
  };

  const startRecordingVideo = () => {
    setStartRecord(true);
  };

  return (
    <div className="video-upload">
      <div className="video-placeholder">
        {startRecord ? (
          <div className="">
            <Webcam
              height={300}
              width={400}
              audio={true}
              mirrored={true}
              ref={webcamRef}
              videoConstraints={videoConstraints}
            />
            <div className="buttons-action">
              {capturing ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
              ) : (
                <button onClick={handleStartCaptureClick}>Start Capture</button>
              )}

              {recordedChunks.length > 0 && (
                <button onClick={handleUpload}>Upload video</button>
              )}
            </div>
          </div>
        ) : videoUrl ? (
          <video width="400" height="300" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="../../static/images/video-placeholder.jpg"
            alt="Video Placeholder"
          />
        )}
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          style={{ display: "none" }}
          id="video-input"
        />
        <div className="video-icon">
          <label htmlFor="video-input">
            <i
              className="fas fa-camera icon"
              onClick={() => {
                setStartRecord(false);
              }}
            ></i>
          </label>

          <i onClick={startRecordingVideo} className="fas fa-video icon"></i>
        </div>
      </div>
      {videoError && <span style={{ color: "red" }}>{videoError}</span>}

      {openAlert && (
        <AlertMessageComponent
          type={openAlert.type}
          message={openAlert.message}
          onClose={closeAlertComponent}
        />
      )}
    </div>
  );
}

export default VideoUploadComponent;
