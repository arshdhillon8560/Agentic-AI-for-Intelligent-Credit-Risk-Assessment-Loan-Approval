import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { officerAPI } from "../services/api";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerAPI.getDetails(id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [id]);

  const handleDecision = async (decision) => {
    await officerAPI.updateDecision({
      application_id: id,
      decision,
      reason,
    });

    alert(`Application ${decision}`);
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const pd = data.agent_result?.credit_pd_score || 0;
  const fraud = data.agent_result?.fraud_probability || 0;
  const emp = data.agent_result?.employment_verified;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-slate-200">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8 space-y-6">
        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-primary font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Application Review
          </h1>
          <p className="text-slate-500 mt-2">{id}</p>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">
            Personal Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <p><b>Name:</b> {data.profile?.name}</p>
            <p><b>DOB:</b> {data.profile?.date_of_birth}</p>
            <p><b>Gender:</b> {data.profile?.gender}</p>
            <p><b>Marital:</b> {data.profile?.marital_status}</p>
            <p><b>PAN:</b> {data.profile?.pan_number}</p>
            <p><b>Aadhaar:</b> {data.profile?.aadhaar_number}</p>
            <p><b>City:</b> {data.profile?.city}</p>
            <p><b>State:</b> {data.profile?.state}</p>
          </div>
        </div>

        {/* EMPLOYMENT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">
            Employment Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <p><b>Type:</b> {data.employment?.employment_type}</p>
            <p><b>Employer:</b> {data.employment?.employer_name}</p>
            <p><b>Job:</b> {data.employment?.job_title}</p>
            <p><b>Experience:</b> {data.employment?.total_work_experience}</p>
            <p><b>Income:</b> ₹{data.employment?.monthly_income}</p>
            <p><b>Salary Mode:</b> {data.employment?.salary_mode}</p>
          </div>
        </div>

        {/* FINANCIAL */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">
            Financial Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <p><b>Existing Loans:</b> {data.financial?.existing_loans}</p>
            <p><b>EMI:</b> ₹{data.financial?.existing_emi}</p>
            <p><b>Bank:</b> {data.financial?.bank_name}</p>
            <p><b>Balance:</b> ₹{data.financial?.average_monthly_balance}</p>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">Documents</h2>

          <div className="flex flex-wrap gap-4">
            <a
              href={`https://docs.google.com/viewer?url=${data.documents?.bank_statement_url}&embedded=true`}
              target="_blank"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              View Bank Statement
            </a>

            <a
              href={`https://docs.google.com/viewer?url=${data.documents?.salary_slip_url}&embedded=true`}
              target="_blank"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              View Salary Slip
            </a>

            <a
              href={`https://docs.google.com/viewer?url=${data.documents?.itr_document_url}&embedded=true`}
              target="_blank"
              className="bg-primary-light text-white px-4 py-2 rounded-lg"
            >
              View ITR
            </a>
          </div>
        </div>

        {/* AI SCORES */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">
            AI Risk Analysis
          </h2>

          {/* ORIGINAL CONTENT */}
          <div className="grid md:grid-cols-2 gap-4">
            <p><b>Credit PD:</b> {pd}</p>
            <p><b>Fraud Risk:</b> {fraud}</p>
            <p><b>Employment Verified:</b> {emp ? "Yes" : "No"}</p>
            <p><b>AI Decision:</b> {data.agent_result?.final_decision}</p>
          </div>

          {/* SCALE CHART */}
          <div className="mt-6">
            <p className="text-sm font-semibold mb-1">Credit Risk Scale</p>
            <div className="h-3 rounded bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
              <div
                className="absolute top-0 h-3 w-2 bg-black"
                style={{ left: `${Math.min(pd * 100000, 100)}%` }}
              />
            </div>

            <p className="text-sm font-semibold mt-4 mb-1">Fraud Risk Scale</p>
            <div className="h-3 rounded bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
              <div
                className="absolute top-0 h-3 w-2 bg-black"
                style={{ left: `${Math.min(fraud * 100000, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs mt-2 text-slate-500">
              <span>LOW</span>
              <span>MEDIUM</span>
              <span>HIGH</span>
            </div>

            {/* ✅ FIXED DECISION HINT */}
            <div className="mt-4 p-3 bg-slate-100 rounded text-sm font-semibold flex items-center gap-2">
              {(() => {
                const pdPercent = pd * 100;
                const fraudPercent = fraud * 100;

                // HIGH → REJECT
                if (pdPercent >= 0.05 || fraudPercent >= 0.05) {
                  return (
                    <>
                      <XCircle className="text-red-500" size={18} />
                      <span>High Risk → Recommended: REJECT</span>
                    </>
                  );
                }

                // MEDIUM → ESCALATE
                if (pdPercent >= 0.01 || fraudPercent >= 0.01 || !emp) {
                  return (
                    <>
                      <AlertTriangle className="text-yellow-500" size={18} />
                      <span>Medium Risk → Recommended: ESCALATE</span>
                    </>
                  );
                }

                // LOW → APPROVE
                return (
                  <>
                    <CheckCircle className="text-sky-600" size={18} />
                    <span>Low Risk → Recommended: APPROVE</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* DECISION BOX */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-primary">Decision</h2>

          <textarea
            placeholder="Enter reason (optional for approve, required for reject)"
            className="w-full border border-slate-300 rounded-lg p-3 mb-4"
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex gap-4">
            <button
              onClick={() => handleDecision("APPROVED")}
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              Approve
            </button>

            <button
              onClick={() => handleDecision("REJECTED")}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};