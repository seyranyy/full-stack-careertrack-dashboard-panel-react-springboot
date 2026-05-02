import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Figma butonun burada dursun
import api from "@/api/api"; // Eklediğimiz axios instance
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Hata mesajı için
  const navigate = useNavigate();



    useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")?.trim().toUpperCase();

    if (token && role === "ADMIN") {
      navigate("/admin-dashboard", { replace: true });
    } else if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/auth/login", { email, password });
  
      const token =
        typeof response.data === "string"
          ? response.data
          : response.data.token ||
            response.data.accessToken ||
            response.data.jwt ||
            response.data.data?.token ||
            response.data.data?.accessToken;
  
      const role =
        response.data?.role ||
        response.data?.user?.role ||
        response.data?.data?.role;
  
      const normalizedRole = role?.trim().toUpperCase();
  
      if (!token || !token.includes(".")) {
        console.error("Geçerli JWT token bulunamadı:", response.data);
        setError("Login başarılı görünüyor ama geçerli token alınamadı.");
        return;
      }
  
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
  
      if (normalizedRole) {
        localStorage.setItem("role", normalizedRole);
      } else {
        localStorage.removeItem("role");
      }
  
      const userName =
        response.data?.name ||
        response.data?.fullName ||
        response.data?.username ||
        response.data?.user?.name ||
        response.data?.data?.name;
  
      if (typeof userName === "string" && userName.trim()) {
        localStorage.setItem("userName", userName.trim());
      } else {
        localStorage.removeItem("userName");
      }
  
      if (normalizedRole === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login hatası:", err);
      console.error("Backend hata cevabı:", err.response?.data);
      setError("Email veya şifre hatalı. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-gray-900 text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your account</p>
            {/* Hata mesajı alanı */}
            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-900 block font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" title="password" className="text-gray-900 block font-medium">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-indigo-600" />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
            </div>

            {/* Figma'dan gelen orijinal gradient butonun */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              
              <Link to="/register" className="text-indigo-600 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}