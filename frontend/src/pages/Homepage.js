import "./Homepage.css";
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../Components/Spinner.js";
import { Link } from "react-router-dom";

import FileSvg from "./images/file-holder.svg";

import copyIcon from "./images/copy-regular.svg";
import axios from "axios";

const Home = () => {
  const [fileName, setfileName] = useState("");
  const [fileUrl, setfileUrl] = useState("");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fileUuid, setFileUuid] = useState(null);

  const [showProgress, setShowProgress] = useState(false);

  const [showCopyLink, setShowCopyLink] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInput = useRef();
  const progressRef = useRef();
  const urlBox = useRef();

  const BrowseFile = () => {
    fileInput.current.click();
  };

  const getBrowseFile = () => {
    setfileName(fileInput.current.files[0].name);
    setFile(fileInput.current.files[0]);
  };

  const formData = new FormData();
  formData.append("myfile", file);

  const uploadUserFile = async () => {
    try {
      if (fileName !== "") {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const fileSize = progressEvent.total;
              const maxSize = 2000000 * 100;
              console.log(file.type);
              if (
                fileSize > maxSize ||
                (!file.type.startsWith("image") &&
                  !file.type.startsWith("application"))
              ) {
                return setUploadProgress(null);
              }

              const percentCompleted = Math.floor(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setUploadProgress(percentCompleted);
              console.log(uploadProgress);
            },
          }
        );

        const data = res.data;

        if (res.status === 201) {
          setfileName("");
          setfileUrl(data.url);
          setFileUuid(data.uuid);
          setUploadProgress(null);
          setShowCopyLink(true);
          toast("File uploaded!", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              fontSize: "1.4rem",
            },
          });
        }
      } else {
        toast("Please upload file first", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "1.4rem",
          },
        });
      }
    } catch (err) {
      if (err.response.status === 500) {
        setShowCopyLink(false);
        toast(err.response.data.msg, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "1.4rem",
          },
        });
      }
    }
  };

  const copyToClipboard = () => {
    urlBox.current.select();
    navigator.clipboard.writeText(fileUrl).then(
      () => {
        toast("Copied success!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "1.4rem",
          },
        });
      },
      () => {
        toast("Copied success!", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontSize: "1.4rem",
          },
        });
      }
    );
  };

  useEffect(() => {
    document.title = "Home";
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="main-container">
        <div className="mid-container">
          <div className="img-container">
            <div className="logo-img">
              <img src={FileSvg} alt="img" id="img" />
            </div>
          </div>

          <div className="select-file-container">
            <input
              type="file"
              name="myfile"
              id="file-input"
              ref={fileInput}
              onChange={getBrowseFile}
            />

            <button type="button" className="file-btn" onClick={BrowseFile}>
              Select
            </button>

            <input type="text" value={fileName} id="file-name-input" readOnly />
          </div>
          <button type="button" className="upload-btn" onClick={uploadUserFile}>
            Get Link
          </button>
        </div>
        {uploadProgress ? (
          <div className="progress-container">
            <h4>Loading...{`${uploadProgress}%`}</h4>
            <div className="progress-bar">
              <div
                className="progress"
                ref={progressRef}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          ""
        )}

        {showCopyLink ? (
          <>
            <div className="copy-link-container">
              <input
                type="text"
                className="urlBox"
                value={fileUrl}
                readOnly
                ref={urlBox}
              />
              <span className="copy-icon" onClick={copyToClipboard}>
                <img src={copyIcon} alt="logo" />
              </span>
            </div>

            <div className="goto-download-page-btn-container">
              <Link to={`/files/download/${fileUuid}`}>
                <button type="button" className="goto-download-btn">
                  Go to Download
                </button>
              </Link>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Home;
