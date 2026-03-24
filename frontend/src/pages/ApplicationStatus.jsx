import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  LogOut,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export const ApplicationStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      const data = await applicationAPI.getStatus(id);

      console.log("API DATA:", data);

      setStatus(data);
      setLoading(false);

      if (data.status === "APPROVED" || data.status === "REJECTED") {
        clearInterval(interval);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusIcon = () => {
    switch (status?.status) {
      case "APPROVED":
        return <CheckCircle className="w-20 h-20 text-sky-600" />;
      case "REJECTED":
        return <XCircle className="w-20 h-20 text-red-500" />;
      case "ESCALATED":
        return <AlertTriangle className="w-20 h-20 text-yellow-500" />;
      default:
        return <Clock className="w-20 h-20 text-sky-500 animate-pulse" />;
    }
  };

  // ✅ FIXED FORMATTER (THIS IS THE MAIN FIX)
  const formatPercentage = (value) => {
    if (value == null) return "N/A";

    const percentage = value * 100;

    // handle extremely small scientific values
    if (percentage > 0 && percentage < 0.000001) {
      return "< 0.000001%";
    }

    return percentage.toFixed(6) + "%";
  };

  // ✅ SAME LOGIC (unchanged)
  const getRiskLevel = (val) => {
    if (val == null) return { label: "N/A", color: "text-slate-500" };

    if (val >= 0.8) return { label: "VERY HIGH", color: "text-red-600" };
    if (val >= 0.5) return { label: "HIGH", color: "text-red-500" };
    if (val >= 0.2) return { label: "MEDIUM", color: "text-yellow-500" };
    if (val >= 0.05) return { label: "LOW", color: "text-sky-500" };
    return { label: "VERY LOW", color: "text-sky-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-sky-600" />
      </div>
    );
  }

  const pd = status?.agent_scores?.credit_pd_score ?? 0;
  const fraud = status?.agent_scores?.fraud_probability ?? 0;

  const finalDecision = status?.agent_scores?.final_decision || status?.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/src/assets/virtusa_logo.png" className="h-8" />

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-700 hover:text-sky-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
        </div>

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
      </header>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-8">
        {/* STATUS CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          {getStatusIcon()}
          <h1 className="text-3xl font-bold mt-4">{status.status}</h1>
          <p className="text-slate-600 mt-2">
            Application ID: {status.application_id}
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-slate-500">Application Status</p>
            <p className="text-xl font-bold">{status.status}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-slate-500">KYC Status</p>
            <p className="text-xl font-bold text-sky-600">
              {status.kyc_status}
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <p className="text-sm text-slate-500">Message</p>
          <p className="font-semibold">{status.user_message}</p>
        </div>

        {/* ANALYTICS */}
        {status.agent_scores && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">Risk Analysis</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CREDIT PD */}
              <div className="p-6 rounded-xl bg-slate-50 border">
                <p className="text-sm text-slate-500 mb-2">Credit Risk (PD)</p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {formatPercentage(pd)}
                  </span>

                  <span className={`font-semibold ${getRiskLevel(pd).color}`}>
                    {getRiskLevel(pd).label}
                  </span>
                </div>

                <div className="mt-3 h-2 bg-slate-200 rounded">
                  <div
                    className="h-2 bg-sky-500 rounded"
                    style={{
                      width: `${Math.min(pd * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* FRAUD */}
              <div className="p-6 rounded-xl bg-slate-50 border">
                <p className="text-sm text-slate-500 mb-2">Fraud Probability</p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {formatPercentage(fraud)}
                  </span>

                  <span
                    className={`font-semibold ${getRiskLevel(fraud).color}`}
                  >
                    {getRiskLevel(fraud).label}
                  </span>
                </div>

                <div className="mt-3 h-2 bg-slate-200 rounded">
                  <div
                    className="h-2 bg-red-400 rounded"
                    style={{
                      width: `${Math.min(fraud * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* EMPLOYMENT */}
              <div className="p-6 rounded-xl bg-slate-50 border text-center">
                <p className="text-sm text-slate-500">Employment Verified</p>
                <p
                  className={`text-xl font-bold ${
                    status.agent_scores.employment_verified
                      ? "text-sky-600"
                      : "text-red-500"
                  }`}
                >
                  {status.agent_scores.employment_verified ? "Yes" : "No"}
                </p>
              </div>

              {/* FINAL DECISION */}
              <div className="p-6 rounded-xl bg-slate-50 border text-center">
                <p className="text-sm text-slate-500">Final Decision</p>
                <p className="text-xl font-bold text-sky-600">
                  {finalDecision}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
