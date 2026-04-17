import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ your token getter (fixed)
const getToken = () =>
  localStorage.getItem("adminToken") ||
  JSON.parse(localStorage.getItem("adminInfo"))?.token;

const useAutoLogout = (timeout = 5 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      // console.log("Activity detected → resetting timer");

      timer = setTimeout(() => {
        const token = getToken();

        if (token) {
          // console.log("Auto logout triggered");

          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminInfo");

          alert("Session expired due to inactivity");

          navigate("/admin/login");
        }
      }, timeout);
    };

    // activity listeners
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // start timer initially
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate, timeout]);
};

export default useAutoLogout;