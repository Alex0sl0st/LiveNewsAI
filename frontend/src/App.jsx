import "./App.css";
import NotFound from "./pages/NotFound/NotFound";
import News from "./pages/News/News";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<News />} />
            <Route path="about" element={<h1>About</h1>} />
            <Route path="contact" element={<h1>Contact</h1>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
