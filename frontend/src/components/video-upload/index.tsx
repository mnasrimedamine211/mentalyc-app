import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import axios from "axios";
import AlertMessageComponent from "../alerts";
import "./videoUpload.css";
import { useNavigate } from "react-router-dom";

const VideoUploadComponent = () => {
  const [processing, setProcessing] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoError, setVideoError] = useState("");
  const [startRecord, setStartRecord] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [openAlert, setOpenAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    console.log(videoUrl);
  }, [videoUrl]);

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
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });

        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );

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
        setStartRecord(false);
        setVideoUrl("");
        setVideoError("Webcam stream not available.");
      }
    } else {
      setCapturing(false);
      setStartRecord(false);
      setVideoUrl("");
      setVideoError("Webcam reference not available.");
    }
  }, [
    webcamRef,
    setCapturing,
    mediaRecorderRef,
    handleDataAvailable,
    setStartRecord,
    setVideoError,
  ]);

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
    const blob = new Blob(recordedChunks, {
      type: "video/mp4",
    });

    const randomNum = Math.floor(Math.random() * 1000) + 1;
    const videoName = `video${randomNum}.mp4`;
    const formData = new FormData();
    formData.append("file", blob, videoName);

    let alertMessage = null;

    if (recordedChunks.length) {
      setProcessing(true);

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
          setProcessing(false);
        })
        .catch((error) => {
          alertMessage = {
            type: "error",
            message: "Operation unsuccessful",
          };

          showAlertComponent(alertMessage.type, alertMessage.message);
          setProcessing(false);
        });

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
    setVideoFile(null);
    setVideoUrl("");

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

  const uploadFileFromDesktop = () => {
    let alertMessage = null;
    const formData = new FormData();

    if (videoFile) {
      formData.append("file", videoFile);
      setProcessing(true);

      axios
        .post("http://localhost:3006/upload", formData)
        .then((response) => {
          if (response && response.data) {
            alertMessage = {
              type: "success",
              message: "Video uploaded successfully",
            };

            showAlertComponent(alertMessage.type, alertMessage.message);
          }
          setProcessing(false);
        })
        .catch((error) => {
          alertMessage = {
            type: "error",
            message: "Video failed to upload",
          };

          showAlertComponent(alertMessage.type, alertMessage.message);
          setProcessing(false);
        });
    }
  };

  return (
    <div className="video-upload">
      <h1 className="title">Record or import your video </h1>
      <div className="video-placeholder">
        {startRecord ? (
          <div className="video-container">
            <Webcam
              height={"100%"}
              width={"100%"}
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
                <button onClick={handleUpload} disabled={processing}>
                  {processing ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Upload video"
                  )}
                </button>
              )}
            </div>
          </div>
        ) : videoUrl ? (
          <div className="video-container">
            <video key={videoUrl} width="100%" height="100%" controls>
              <source src={videoUrl} type="video/mp4" />
            </video>

            <div className="buttons-action">
              <button onClick={uploadFileFromDesktop}>
                {processing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Upload video"
                )}
              </button>
            </div>
          </div>
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
              className="fas fa-upload icon"
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
};

export default VideoUploadComponent;
