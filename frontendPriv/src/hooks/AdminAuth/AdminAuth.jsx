import { useEffect, useState } from "react";

export default function useAdminAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/login/checkAdmin", {
          method: "GET",
          credentials: "include", 
        });
        const data = await res.json();
        setIsAuth(data.ok); 
      } catch (error) {
        console.error(error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  return { isAuth, loading };
}
