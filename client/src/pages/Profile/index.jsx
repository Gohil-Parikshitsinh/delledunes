import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, updatePassword } from "../../api/user.js";
import useAuth from "../../hooks/useAuth.js";

// ── SECTION CARD ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, children }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #F0EFEB",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}>
    <div>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "20px",
        letterSpacing: "0.06em",
        color: "#1A1A1A",
        margin: "0 0 4px",
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "12px",
        color: "#9A9A9A",
        margin: 0,
      }}>
        {subtitle}
      </p>
    </div>
    <div style={{ borderTop: "1px solid #F0EFEB" }} />
    {children}
  </div>
);

// ── FORM FIELD ────────────────────────────────────────────────────────────────
const FormField = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: error ? "#E53E3E" : "#1A1A1A",
    }}>
      {label}
    </label>
    {children}
    {error && (
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        color: "#E53E3E",
        margin: 0,
      }}>
        {error}
      </p>
    )}
  </div>
);

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 12px",
  background: "#fff",
  border: `1.5px solid ${error ? "#E53E3E" : "#E0DED8"}`,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#1A1A1A",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
});

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ── Profile handlers ───────────────────────────────────────────────────────
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((p) => ({ ...p, [name]: value }));
    if (profileErrors[name]) setProfileErrors((p) => ({ ...p, [name]: "" }));
    setProfileSuccess("");
  };

  const validateProfile = () => {
    const e = {};
    if (!profileForm.name.trim()) e.name = "Name is required";
    if (profileForm.phone && !/^[0-9]{10}$/.test(profileForm.phone))
      e.phone = "Enter a valid 10-digit phone number";
    return e;
  };

  const handleProfileSave = async () => {
    const e = validateProfile();
    if (Object.keys(e).length > 0) { setProfileErrors(e); return; }
    setProfileSaving(true);
    setProfileSuccess("");
    try {
      const data = await updateProfile(profileForm);
      setUser((prev) => ({ ...prev, ...data.user }));
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileErrors({
        submit: err?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Password handlers ──────────────────────────────────────────────────────
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((p) => ({ ...p, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((p) => ({ ...p, [name]: "" }));
    setPasswordSuccess("");
  };

  const validatePassword = () => {
    const e = {};
    if (!passwordForm.currentPassword) e.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) e.newPassword = "New password is required";
    if (passwordForm.newPassword.length < 6) e.newPassword = "Must be at least 6 characters";
    if (!passwordForm.confirmPassword) e.confirmPassword = "Please confirm your new password";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handlePasswordSave = async () => {
    const e = validatePassword();
    if (Object.keys(e).length > 0) { setPasswordErrors(e); return; }
    setPasswordSaving(true);
    setPasswordSuccess("");
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordErrors({
        submit: err?.response?.data?.message || "Failed to update password",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F4F0",
      paddingTop: "80px",
    }}>
      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>

        {/* Page header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "0.04em",
              color: "#1A1A1A",
              margin: "0 0 4px",
            }}>
              My Profile
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9A9A9A",
              margin: 0,
            }}>
              Manage your account details
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/orders")}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "1px solid #E0DED8",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1A1A1A";
                e.currentTarget.style.color = "#F5F4F0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "#1A1A1A";
              }}
            >
              My Orders
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "1px solid #E0DED8",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#E53E3E",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E53E3E";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#E53E3E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "#E53E3E";
                e.currentTarget.style.borderColor = "#E0DED8";
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Avatar + name banner */}
        <div style={{
          background: "#1A1A1A",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "#C9B99A",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "24px",
              color: "#1A1A1A",
              letterSpacing: "0.04em",
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.06em",
              color: "#F5F4F0",
              margin: "0 0 4px",
            }}>
              {user?.name}
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#9A9A9A",
              margin: "0 0 6px",
            }}>
              {user?.email}
            </p>
            <span style={{
              background: user?.role === "admin" ? "#C9B99A" : "#333",
              color: user?.role === "admin" ? "#1A1A1A" : "#9A9A9A",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 10px",
            }}>
              {user?.role || "customer"}
            </span>
          </div>
        </div>

        {/* ── Personal Info ──────────────────────────────────────────────────── */}
        <SectionCard
  title="Personal Information"
  subtitle="Update your name and phone number"
>
  {profileErrors.submit && (
    <div style={{
      padding: "10px 14px",
      background: "#FFF5F5",
      border: "1px solid #FED7D7",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      color: "#E53E3E",
    }}>
      {profileErrors.submit}
    </div>
  )}

  {profileSuccess && (
    <div style={{
      padding: "10px 14px",
      background: "#F0FFF4",
      border: "1px solid #C6F6D5",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      color: "#276749",
    }}>
      {profileSuccess}
    </div>
  )}

  {/* Email — read only */}
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#9A9A9A",
    }}>
      Email Address
    </label>
    <div style={{
      padding: "10px 12px",
      background: "#F5F4F0",
      border: "1.5px solid #F0EFEB",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      color: "#9A9A9A",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span>{user?.email}</span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#C4C2BE",
      }}>
        Cannot be changed
      </span>
    </div>
  </div>

  <FormField label="Full Name" error={profileErrors.name}>
    <input
      name="name"
      value={profileForm.name}
      onChange={handleProfileChange}
      placeholder="Your full name"
      style={inputStyle(profileErrors.name)}
      onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
      onBlur={(e) => e.target.style.borderColor = profileErrors.name ? "#E53E3E" : "#E0DED8"}
    />
  </FormField>

  <FormField label="Phone Number" error={profileErrors.phone}>
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        color: "#9A9A9A",
      }}>
        +91
      </span>
      <input
        name="phone"
        type="tel"
        value={profileForm.phone}
        onChange={handleProfileChange}
        placeholder="9876543210"
        maxLength={10}
        style={{ ...inputStyle(profileErrors.phone), paddingLeft: "44px" }}
        onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
        onBlur={(e) => e.target.style.borderColor = profileErrors.phone ? "#E53E3E" : "#E0DED8"}
      />
    </div>
  </FormField>

  <button
    onClick={handleProfileSave}
    disabled={profileSaving}
    style={{
      alignSelf: "flex-start",
      padding: "11px 28px",
      background: "#1A1A1A",
      color: "#F5F4F0",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      border: "none",
      cursor: profileSaving ? "not-allowed" : "pointer",
      opacity: profileSaving ? 0.7 : 1,
      transition: "all 0.15s",
    }}
    onMouseEnter={(e) => {
      if (!profileSaving) {
        e.currentTarget.style.background = "#C9B99A";
        e.currentTarget.style.color = "#1A1A1A";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#1A1A1A";
      e.currentTarget.style.color = "#F5F4F0";
    }}
  >
    {profileSaving ? "Saving..." : "Save Changes"}
  </button>
</SectionCard>

        {/* ── Change Password ────────────────────────────────────────────────── */}
        <SectionCard
          title="Change Password"
          subtitle="Use a strong password with at least 6 characters"
        >
          {passwordErrors.submit && (
            <div style={{
              padding: "10px 14px",
              background: "#FFF5F5",
              border: "1px solid #FED7D7",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#E53E3E",
            }}>
              {passwordErrors.submit}
            </div>
          )}

          {passwordSuccess && (
            <div style={{
              padding: "10px 14px",
              background: "#F0FFF4",
              border: "1px solid #C6F6D5",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#276749",
            }}>
              {passwordSuccess}
            </div>
          )}

          <FormField label="Current Password" error={passwordErrors.currentPassword}>
            <input
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              style={inputStyle(passwordErrors.currentPassword)}
              onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
              onBlur={(e) => e.target.style.borderColor = passwordErrors.currentPassword ? "#E53E3E" : "#E0DED8"}
            />
          </FormField>

          <div className="pass-grid">
            <FormField label="New Password" error={passwordErrors.newPassword}>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min 6 characters"
                style={inputStyle(passwordErrors.newPassword)}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = passwordErrors.newPassword ? "#E53E3E" : "#E0DED8"}
              />
            </FormField>

            <FormField label="Confirm New Password" error={passwordErrors.confirmPassword}>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                style={inputStyle(passwordErrors.confirmPassword)}
                onFocus={(e) => e.target.style.borderColor = "#1A1A1A"}
                onBlur={(e) => e.target.style.borderColor = passwordErrors.confirmPassword ? "#E53E3E" : "#E0DED8"}
              />
            </FormField>
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={passwordSaving}
            style={{
              alignSelf: "flex-start",
              padding: "11px 28px",
              background: "#1A1A1A",
              color: "#F5F4F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: "none",
              cursor: passwordSaving ? "not-allowed" : "pointer",
              opacity: passwordSaving ? 0.7 : 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!passwordSaving) {
                e.currentTarget.style.background = "#C9B99A";
                e.currentTarget.style.color = "#1A1A1A";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1A1A1A";
              e.currentTarget.style.color = "#F5F4F0";
            }}
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </SectionCard>

        {/* ── Danger Zone ───────────────────────────────────────────────────── */}
        <div style={{
          padding: "20px 24px",
          border: "1px solid #FED7D7",
          background: "#FFF5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#E53E3E",
              margin: "0 0 3px",
            }}>
              Sign out of your account
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#9A9A9A",
              margin: 0,
            }}>
              You can log back in at any time
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "9px 20px",
              background: "#E53E3E",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Logout
          </button>
        </div>

        <style>{`
          .pass-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          @media (max-width: 540px) {
            .pass-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfilePage;