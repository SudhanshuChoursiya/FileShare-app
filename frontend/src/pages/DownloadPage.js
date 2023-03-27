import "./DownloadPage.css";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import download from "downloadjs";
import DownloadSvg from "./images/download.svg";
import Spinner from "../Components/Spinner.js";
import axios from "axios";
import io from "socket.io-client";

const Downloadpage = () => {
  const [fileInfo, setFileInfo] = useState({});

  const [loading, setLoading] = useState(true);

  const [fileExpired, setFileExpired] = useState(false);

  const { uuid } = useParams();

  const getFileInfo = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/file-info/${uuid}`
      );
      const data = res.data;
      if (res.status === 201) {
        setFileInfo(data.fileDetails);
        setFileExpired(false);
      }
    } catch (err) {
      setFileExpired(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/download/${uuid}`
    );
    const blob = await res.blob();
    download(blob, `${fileInfo.filename}`);
  };

  useEffect(() => {
    const socket = io.connect(process.env.REACT_APP_SOCKET_CONNECTION);

    socket.on("file-expired", () => {
      getFileInfo();
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Download";
    getFileInfo();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {fileExpired !== true ? (
        <>
          <div className="download-page-container">
            <div className="download-main-container">
              <img src={DownloadSvg} alt="img" />
              <h3>Expires in 24 hrs.</h3>
              <span className="file-title">
                <h4>{fileInfo.filename}</h4>
              </span>
              <span className="file-size">
                <h4>
                  Size: {(parseInt(fileInfo.filesize) / 1000000).toFixed(2)} MB
                </h4>
              </span>
              <button
                type="button"
                className="download-btn"
                onClick={downloadFile}
              >
                Download File
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="link-expired-container">
          <h2>Link has been Expired please upload again</h2>
          <Link to="/">
            <button className="upload-again-btn">Upload Again</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Downloadpage;
