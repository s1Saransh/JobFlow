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
    <div className="flex min-h-screen items-center justify-center bg-background p-lg">
      <div className="w-full max-w-md bg-surface p-xl rounded-xl shadow-resting border border-outline-variant/30">
        <div className="flex items-center gap-sm mb-lg justify-center">
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">bolt</span>
          </div>
          <span className="font-h2 text-h2 font-bold text-primary">JobFlow</span>
        </div>

        <div className="text-center mb-lg">
          <h1 className="font-h2 text-h2 text-on-surface">{isRegister ? "Create Account" : "Welcome Back"}</h1>
          <p className="font-body-sm text-on-surface-variant mt-xs">
            {isRegister
              ? "Start tracking your applications today."
              : "Sign in to your account."}
          </p>
        </div>

        {error && (
          <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg font-label-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          {isRegister && (
            <div className="space-y-xs">
              <label htmlFor="name" className="font-label-md text-on-surface">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
              />
            </div>
          )}

          <div className="space-y-xs">
            <label htmlFor="email" className="font-label-md text-on-surface">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
            />
          </div>

          <div className="space-y-xs">
            <label htmlFor="password" className="font-label-md text-on-surface">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-lg bg-primary text-on-primary py-sm px-md rounded-full font-label-md hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-xs disabled:opacity-50"
          >
            {loading ? "Processing..." : (isRegister ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <p className="mt-lg text-center font-body-sm text-on-surface-variant">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-primary font-label-md hover:underline decoration-2 underline-offset-4 ml-xs"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
