import { useEffect } from "react";

export default function OAuthSuccess() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
      const email = payload.sub;
      const name = payload.name || payload.username || payload.sub;

      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email,
          role,
        })
      );

      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "TECHNICIAN") {
        window.location.href = "/technician";
      } else if (role === "USER") {
        window.location.href = "/user";
      }
    }
  }, []);

  return <h2>Logging in...</h2>;
}