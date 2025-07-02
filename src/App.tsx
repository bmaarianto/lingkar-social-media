import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Navbar />

      {/* Main Content Area - no padding needed since navbar is not fixed */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
