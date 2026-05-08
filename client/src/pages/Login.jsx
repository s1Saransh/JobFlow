import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    
    // Only send name if registering
    const payload = isRegister 
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      
      // Navigate to dashboard
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">JobFlow</span>
        </div>

        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>
        <p className="page-subtitle">
          {isRegister
            ? "Start tracking your applications today."
            : "Sign in to your account."}
        </p>

        {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Please wait..." : (isRegister ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
