
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import Grammar from "./pages/Grammar";
import Vocabulary from "./pages/Vocabulary";
import Sentences from "./pages/Sentences";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Member 1 - Authentication and Dashboard */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Member 2 - Learning Features */}
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/sentences" element={<Sentences />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
