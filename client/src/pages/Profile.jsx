
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-loading">Please login to view your profile.</div>;
  }

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main profile-main">
        <div className="profile-heading">
          <div>
            <p className="profile-eyebrow">ACCOUNT SETTINGS</p>
            <h1>My Profile</h1>
            <p>View your personal account information.</p>
          </div>
        </div>

        <section className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || "S"}
          </div>

          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          <span className="profile-role">
            {user.role || "Student"}
          </span>

          <div className="profile-details">
            <div className="profile-detail">
              <span>Full Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="profile-detail">
              <span>Email Address</span>
              <strong>{user.email}</strong>
            </div>

            <div className="profile-detail">
              <span>Account Type</span>
              <strong>{user.role || "Student"}</strong>
            </div>

            <div className="profile-detail">
              <span>Joined On</span>
              <strong>{createdDate}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
