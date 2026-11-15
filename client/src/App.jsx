
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

import TakeExam from "./pages/TakeExam";
import ExamResults from "./pages/ExamResults";
import Exams from "./pages/Exams";
import ExamResult from "./pages/ExamResult";

import AdminDashboard from "./pages/AdminDashboard";
import AdminExams from "./pages/AdminExams";
import AdminResults from "./pages/AdminResults";

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

        {/* Member 3 - Student Exams */}
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<TakeExam />} />
        <Route path="/results" element={<ExamResults />} />
        <Route
          path="/exam-result/:resultId"
          element={<ExamResult />}
        />

        {/* Member 3 - Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/results" element={<AdminResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
