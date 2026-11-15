
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        English<span>Ease.</span>
      </div>

      <div className="sidebar-menu">
        <p className="sidebar-label">MAIN MENU</p>

        <NavLink to="/dashboard" className="sidebar-link">
          <span>DB</span>
          Dashboard
        </NavLink>

        <p className="sidebar-label">LEARNING</p>

        <NavLink to="/grammar" className="sidebar-link">
          <span>GR</span>
          Grammar Practice
        </NavLink>

        <NavLink to="/vocabulary" className="sidebar-link">
          <span>VO</span>
          Vocabulary
        </NavLink>

        <NavLink to="/sentences" className="sidebar-link">
          <span>SP</span>
          Sentence Practice
        </NavLink>

        <p className="sidebar-label">ASSESSMENT</p>

        <NavLink to="/exams" className="sidebar-link">
          <span>EX</span>
          Online Exams
        </NavLink>

        <NavLink to="/results" className="sidebar-link">
          <span>RS</span>
          My Results
        </NavLink>

        <p className="sidebar-label">ACCOUNT</p>

        <NavLink to="/profile" className="sidebar-link">
          <span>PR</span>
          My Profile
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <button onClick={handleLogout} className="sidebar-logout">
          <span>LO</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
