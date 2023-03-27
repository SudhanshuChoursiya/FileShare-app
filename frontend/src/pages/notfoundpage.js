import "./Notfoundpage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner.js";

const Notfoundpage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Error 404";
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <div className="notfoundpage">
        <img src="sad-image.svg" alt="img" />

        <h1>404</h1>
        <h2>Page not found</h2>
        <p>
          The page you are looking for doesn't exist or an another error occured
        </p>
        <span>
          <li className="goback_button" onClick={() => navigate(-1)}>
            Click here to Go Back
          </li>
        </span>
      </div>
    </>
  );
};

export default Notfoundpage;
