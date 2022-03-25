import { Route, Routes } from "react-router-dom";
import { Book, Search, Navbar, Loader, Upload } from "./Components"
import { Suspense, lazy } from "react"

const Home = lazy(() => import("./Pages"))
const Reading = lazy(() => import("./Pages/Reading"))

function App() {
  return (
    <div className="relative bg-white min-h-screen">
      <Navbar />
      <Search />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/reading/:book" element={<Reading />} />
        </Routes>
      </Suspense>
      <Book />
      <Upload />
    </div>
  );
}

export default App;
