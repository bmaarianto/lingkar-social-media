import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Navbar />

      {/* Main Content Area with top padding to account for fixed navbar */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
