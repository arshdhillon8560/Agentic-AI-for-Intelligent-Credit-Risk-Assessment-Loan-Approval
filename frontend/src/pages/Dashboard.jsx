import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, PlusCircle, FileText } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await applicationAPI.getAll();
      setApplications(data);
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
    navigate('/login');
  };

  const handleOpenApplication = (id) => {
    navigate(`/status/${id}`);
  };

  const handleNewApplication = () => {
    navigate('/new-application');
  };

  // 🎨 STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'ESCALATED':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-sky-100 text-sky-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200">

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

          {/* LEFT - LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/virtusa_logo.png"
              alt="Virtusa"
              className="h-8"
            />
            <h2 className="font-semibold text-slate-700 hidden md:block">
              Loan Dashboard
            </h2>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={handleNewApplication}
              className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2 rounded-xl hover:bg-sky-700 transition shadow"
            >
              <PlusCircle size={18} />
              New Application
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-10">

        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Your Applications
        </h1>

        {loading ? (
          <div className="text-center text-slate-600">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-slate-600">
            No applications found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {applications.map((app) => (
              <div
                key={app.application_id}
                onClick={() => handleOpenApplication(app.application_id)}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-slate-200"
              >

                {/* ICON */}
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

                {/* KYC */}
                <p className="text-sm text-slate-600 mb-1">
                  KYC Status:
                  <span className="ml-1 font-medium">
                    {app.kyc_status}
                  </span>
                </p>

                {/* DATE */}
                <p className="text-xs text-slate-400 mt-3">
                  {new Date(app.created_at).toLocaleString()}
                </p>

                {/* HOVER EFFECT LINE */}
                <div className="mt-4 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};