import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call auth API
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
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
