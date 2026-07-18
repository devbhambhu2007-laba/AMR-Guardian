import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Landing from "./pages/Landing";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Learn from "./pages/Learn";

// NEW
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </Layout>

      {/* Floating chatbot */}
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;