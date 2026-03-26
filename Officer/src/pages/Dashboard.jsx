import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { officerAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, FileText, AlertTriangle } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await officerAPI.getEscalated();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenApplication = (id) => {
    navigate(`/application/${id}`);
  };

  // 🎨 STATUS COLOR (same as your dashboard)
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "ESCALATED":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-sky-100 text-sky-700";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-slate-200">
      {/* HEADER (SAME STYLE) */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img src="/src/assets/favicon.png" alt="Virtusa" className="h-8" />
            <h2 className="font-semibold text-primary hidden md:block">
              Credit Officer Dashboard
            </h2>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleLogout}
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
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* TITLE */}
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="text-yellow-500" />
          <h1 className="text-3xl font-bold text-slate-800">
            Escalated Applications
          </h1>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center text-slate-600">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-slate-600">
            No escalated applications found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app) => (
              <div
                key={app.application_id}
                onClick={() => handleOpenApplication(app.application_id)}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-slate-200"
              >
                {/* ICON + STATUS */}
                <div className="mb-4 flex justify-between items-center">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
                    <FileText />
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(app.status)}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* ID */}
                <h3 className="font-semibold text-lg text-slate-800 mb-2 truncate">
                  {app.application_id}
                </h3>

                {/* LOAN */}
                <p className="text-sm text-slate-600 mb-1">
                  Loan Amount:
                  <span className="ml-1 font-medium">₹{app.loan_amount}</span>
                </p>

                {/* PURPOSE */}
                <p className="text-sm text-slate-600 mb-1">
                  Purpose:
                  <span className="ml-1 font-medium">{app.loan_purpose}</span>
                </p>

                {/* DATE */}
                <p className="text-xs text-slate-400 mt-3">
                  {new Date(app.created_at).toLocaleString()}
                </p>

                {/* HOVER LINE */}
                <div className="mt-4 h-1 bg-linear-to-r from-sky-500 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
