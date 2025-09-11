import React from "react";
import { useState } from "react";
import styles from "./Signup.module.css";
import VoltBoxLogo from "../../components/VotBoxLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Signup() {
  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ fullName, email, password, confirmPassword, agreeTerms });
    const payload = {
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const doc = await res.json();

      if (res.ok) {
        console.log("✅ Success:", doc);
        toast.success("✅ Account created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreeTerms(false);
        localStorage.setItem("user", JSON.stringify(doc));
        navigate("/dashboard");
      } else {
        console.error("❌ Error from server:", doc.message || doc);
        toast.error("❌ server error");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      toast.error("❌ Network error");
    }
  };

  return (
    <>
      <div className={styles.registerContainer}>
        <header className={styles.header}>
          <VoltBoxLogo />
        </header>
        <div className={styles.registerPanel}>
          <div className={styles.registerCard}>
            <h1 className={styles.registerTitle}>
              Create Your VoltBox
              <br />
              Account
            </h1>
            <p className={styles.registerSubtitle}>
              Start storing your world securely in the cloud
            </p>

            <form className={styles.registerForm} onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="email"
                className={styles.formInput}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className={styles.formInput}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className={styles.formInput}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <div className={styles.passwordError}>{passwordError}</div>
              )}

              <label className={styles.terms}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms &amp; Conditions
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className={`${styles.btn} ${styles.primary}`}
              >
                Sign Up
              </button>

              <div className={styles.orSeparator}>
                <span>or</span>
              </div>

              <button
                type="button"
                className={`${styles.btn} ${styles.google}`}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className={styles.googleIcon}
                />
                Continue with Google
              </button>
            </form>

            <div className={styles.bottomLinks}>
              Already have an account?
              <NavLink to="/login">Login</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
