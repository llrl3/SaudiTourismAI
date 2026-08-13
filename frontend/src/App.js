import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import DestinationDetail from "@/pages/DestinationDetail";
import TripPlanner from "@/pages/TripPlanner";
import Chat from "@/pages/Chat";
import ImageAnalysis from "@/pages/ImageAnalysis";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/image" element={<ImageAnalysis />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
}

export default App;
