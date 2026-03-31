import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationAPI, kycAPI } from "../services/api";
import { KYCVerification } from "../components/KYCVerification";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, ArrowLeft } from "lucide-react";

export const KYCPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [kycData, setKycData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await applicationAPI.getApplicationDetails(id);

        const profile = res.profile || {};

        setKycData({
          name: profile.name || "",
          pan_number: profile.pan_number || "",
          aadhaar_number: profile.aadhaar_number || "",
          date_of_birth: profile.date_of_birth
            ? profile.date_of_birth.split("T")[0]
            : "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePANVerify = async (data) => {
    return await kycAPI.verifyPAN(data);
  };

  const handleSendOTP = async (data) => {
    return await kycAPI.sendOTP(data);
  };

  const handleVerifyOTP = async (data) => {
    await kycAPI.verifyOTP(data);
    navigate(`/status/${id}`);
  };

  if (!kycData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading KYC...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200">
      {/* HEADER (SAME AS STATUS PAGE) */}
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
      <div className="max-w-4xl mx-auto p-8">
        {/* TITLE CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
          <h1 className="text-2xl font-bold">Complete KYC</h1>
          <p className="text-slate-500 mt-1">Application ID: {id}</p>
        </div>

        {/* KYC FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <KYCVerification
            applicationId={id}
            profileData={kycData}
            onPANVerify={handlePANVerify}
            onSendOTP={handleSendOTP}
            onVerifyOTP={handleVerifyOTP}
          />
        </div>
      </div>
    </div>
  );
};
