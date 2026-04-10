import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import PhotoReleasePage from "./pages/PhotoReleasePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="main">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/past" element={<EventsPage past />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/photo-release" element={<PhotoReleasePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
