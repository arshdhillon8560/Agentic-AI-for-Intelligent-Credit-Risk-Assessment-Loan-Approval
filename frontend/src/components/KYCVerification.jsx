import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const KYCVerification = ({
  onPANVerify,
  onSendOTP,
  onVerifyOTP,
  applicationId,
  profileData
}) => {
  const [panVerified, setPanVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePANVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const dobParts = profileData.date_of_birth.split('-');
      const formattedDOB = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;

      await onPANVerify({
        application_id: applicationId,
        pan: profileData.pan_number,
        name: profileData.name,
        dob: formattedDOB
      });
      setPanVerified(true);
    } catch (err) {
      setError(err.message || 'PAN verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
  
    try {
      const response = await onSendOTP({
        aadhaar: profileData.aadhaar_number
      });
  
      console.log("SEND OTP RESPONSE:", response);
  
      const refId = response?.data?.reference_id;
  
      if (!refId) {
        throw new Error("Reference ID not received from server");
      }
  
      setReferenceId(refId.toString()); // ✅ convert to string (important)
      setOtpSent(true);
  
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
  
    try {
      await onVerifyOTP({
        application_id: applicationId,
        reference_id: referenceId.toString().trim(),
        otp: otp.toString().trim()
      });
  
      setOtpVerified(true);
  
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">PAN Verification</h3>

        {panVerified ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>PAN Verified Successfully</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              PAN: {profileData.pan_number}
            </p>
            <button
              onClick={handlePANVerify}
              disabled={loading}
              className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify PAN'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aadhaar OTP Verification</h3>

        {!panVerified ? (
          <div className="flex items-center gap-2 text-slate-500">
            <AlertCircle className="w-5 h-5" />
            <span>Please verify PAN first</span>
          </div>
        ) : otpVerified ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Aadhaar Verified Successfully - Processing Application...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Aadhaar: {profileData.aadhaar_number}
            </p>

            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>OTP Sent Successfully</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
