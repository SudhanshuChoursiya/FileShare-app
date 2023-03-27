import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage.js";
import Downloadpage from "./pages/DownloadPage.js";
import Notfoundpage from "./pages/notfoundpage.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/files/download/:uuid" element={<Downloadpage />} />
          <Route path="*" element={<Notfoundpage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
