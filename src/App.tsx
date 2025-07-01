import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
