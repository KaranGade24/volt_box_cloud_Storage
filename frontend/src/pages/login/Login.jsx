import React, { useRef, useState } from "react";
import styles from "./Login.module.css";
import image from "../../assets/cloud-cube.png";
import VoltBoxLogo from "../../components/VotBoxLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const emailValue = useRef("");
  const passwordValue = useRef("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailValue.current.value;
    const password = passwordValue.current.value;
    if (!email || !password) {
      toast.error("Please enter both email and password.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    const payload = {
      email,
      password,
    };

    console.log(payload);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // if using cookies
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        const err = await res.json();
        toast.error(err.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Try again later.");
    } finally {
      // Reset form fields
      setLoading(false);
      emailValue.current.value = "";
      passwordValue.current.value = "";
    }
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      <header className={styles.header}>
        <VoltBoxLogo />
      </header>
      <div className={styles.loginPanel}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>
            Welcome back
            <br />
            to VoltBox
          </h1>
          <p className={styles.loginSubtitle}>
            Securely access your files anytime, anywhere
          </p>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.loginInput}
              placeholder="Enter your email"
              ref={emailValue}
            />
            <input
              type="password"
              className={styles.loginInput}
              placeholder="Enter your password"
              ref={passwordValue}
            />
            <div className={styles.loginOptions}>
              {/* <label> */}
              {/* <input type="checkbox" /> */}
              {/* <span>Remember me</span> */}
              {/* </label> */}
              {/* <a href="#" className={styles.forgot}>
                Forgot password?
              </a> */}
            </div>
            <button type="submit" className={`${styles.btn} ${styles.primary}`}>
              {loading ? "Loading..." : "Login"}
            </button>
            {/* <button type="button" className={`${styles.btn} ${styles.google}`}>
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className={styles.googleIcon}
              />
              Sign in with Google
            </button> */}
          </form>
          <div className={styles.bottomLinks}>
            Don't have an account?
            <NavLink to="/signup">Signup</NavLink>
          </div>
        </div>
        {/* <div className={styles.illustration}>
          <img src={image} alt="Cloud Cube" />
        </div> */}
      </div>
    </div>
  );
}
