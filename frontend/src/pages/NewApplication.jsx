import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI, kycAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

import { ApplicationForm } from '../components/ApplicationForm';
import { ProfileForm } from '../components/ProfileForm';
import { EmploymentForm } from '../components/EmploymentForm';
import { FinancialForm } from '../components/FinancialForm';
import { DocumentUpload } from '../components/DocumentUpload';
import { KYCVerification } from '../components/KYCVerification';

import { LogOut, CheckCircle, ArrowLeft } from 'lucide-react';

export const NewApplication = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [applicationId, setApplicationId] = useState('');
  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    'Create Application',
    'Profile Details',
    'Employment Details',
    'Financial Details',
    'Upload Documents',
    'KYC Verification'
  ];

  // ---------------- HANDLERS ----------------

  const handleCreateApplication = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await applicationAPI.create(data);
      setApplicationId(res.application_id);
      localStorage.setItem('appId', res.application_id);
      setCurrentStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (data) => {
    setLoading(true);
    setError('');
    try {
      await applicationAPI.saveProfile(data);
      setProfileData(data);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployment = async (data) => {
    setLoading(true);
    setError('');
    try {
      await applicationAPI.saveEmployment(data);
      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFinancial = async (data) => {
    setLoading(true);
    setError('');
    try {
      await applicationAPI.saveFinancial(data);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocuments = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await applicationAPI.uploadDocuments(formData);
      setCurrentStep(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePANVerify = async (data) => {
    return await kycAPI.verifyPAN(data);
  };

  const handleSendOTP = async (data) => {
    return await kycAPI.sendOTP(data);
  };

 const handleVerifyOTP = async (data) => {
  await kycAPI.verifyOTP(data);

  const pollStatus = async () => {
    try {
      const res = await applicationAPI.getStatus(applicationId);

      if (res.status === 'APPROVED' || res.status === 'REJECTED') {
        navigate(`/status/${applicationId}`);
      } else {
        setTimeout(pollStatus, 2000);
      }

    } catch {
      setTimeout(pollStatus, 2000);
    }
  };

  pollStatus();
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200">

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/virtusa_logo.png"
              alt="Virtusa"
              className="h-8"
            />

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-700 hover:text-sky-600"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-700 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Apply for Loan
          </h1>
          <p className="text-slate-600">
            Complete all steps to submit your application
          </p>
        </div>

        {/* STEPPER */}
        <div className="mb-12">
  <div className="flex items-center justify-between relative">

    {steps.map((step, index) => (
      <div key={index} className="flex flex-col items-center flex-1 relative">

        {/* LINE (drawn behind circles) */}
        {index !== 0 && (
          <div className="absolute top-5 left-[-50%] w-full h-[2px]">
            <div className="w-full h-full bg-slate-200 rounded" />
            {index <= currentStep && (
              <div className="absolute inset-0 bg-green-500 rounded" />
            )}
          </div>
        )}

        {/* CIRCLE */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
            index < currentStep
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-sky-600 text-white'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          {index < currentStep ? <CheckCircle size={18} /> : index + 1}
        </div>

        {/* LABEL */}
        <span className="text-xs mt-3 text-slate-600 text-center max-w-[110px] leading-tight">
          {step}
        </span>
      </div>
    ))}

  </div>
</div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">

          {currentStep === 0 && (
            <ApplicationForm onSubmit={handleCreateApplication} loading={loading} />
          )}

          {currentStep === 1 && (
            <ProfileForm
              onSubmit={handleSaveProfile}
              loading={loading}
              applicationId={applicationId}
            />
          )}

          {currentStep === 2 && (
            <EmploymentForm
              onSubmit={handleSaveEmployment}
              loading={loading}
              applicationId={applicationId}
            />
          )}

          {currentStep === 3 && (
            <FinancialForm
              onSubmit={handleSaveFinancial}
              loading={loading}
              applicationId={applicationId}
            />
          )}

          {currentStep === 4 && (
            <DocumentUpload
              onSubmit={handleUploadDocuments}
              loading={loading}
              applicationId={applicationId}
            />
          )}

          {currentStep === 5 && profileData && (
            <KYCVerification
              onPANVerify={handlePANVerify}
              onSendOTP={handleSendOTP}
              onVerifyOTP={handleVerifyOTP}
              applicationId={applicationId}
              profileData={profileData}
            />
          )}

        </div>
      </div>
    </div>
  );
};