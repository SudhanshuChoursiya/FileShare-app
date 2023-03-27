import "./Spinner.css";
import spinnerSvg from "./spinner.svg";
const Spinner = () => {
  return (
    <>
      <div className="spinner-main-container">
        <div className="spinner-container">
          <img src={spinnerSvg} alt="svg" />
        </div>
      </div>
    </>
  );
};

export default Spinner;
