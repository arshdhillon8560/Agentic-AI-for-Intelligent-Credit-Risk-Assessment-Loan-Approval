import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <div className="flex justify-center items-center gap-2">
        <img
              src="/src/assets/favicon.png"
              alt="Virtusa"
              className="h-8"
            />
      <h1 className="text-xl font-bold text-primary">
        Credit Officer Panel
      </h1>

      </div>
      

      <button
  onClick={() => {
    logout();
    navigate("/login");
  }}
  className="flex items-center gap-2 px-4 py-2 rounded-xl 
             bg-red-500 text-white font-medium 
             shadow-md transition-all duration-200 
             hover:bg-red-600 hover:shadow-lg 
             active:scale-95"
>
  <LogOut size={18} />
  Logout
</button>
    </div>
  );
};