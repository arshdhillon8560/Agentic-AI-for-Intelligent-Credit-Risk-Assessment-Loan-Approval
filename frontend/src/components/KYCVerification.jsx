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

      const refId = response?.data?.reference_id;

      if (!refId) {
        throw new Error("Reference ID not received");
      }

      setReferenceId(refId.toString());
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

      // ✅ DO NOT show success — just move to processing state
      setOtpVerified(true);

    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* PAN */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-4">PAN Verification</h3>

        {panVerified ? (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle size={18} />
            PAN Verified
          </div>
        ) : (
          <button
            onClick={handlePANVerify}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded"
          >
            {loading ? 'Verifying...' : 'Verify PAN'}
          </button>
        )}
      </div>

      {/* AADHAAR */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Aadhaar Verification</h3>

        {!panVerified ? (
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle size={18} />
            Verify PAN first
          </div>
        ) : otpVerified ? (

          /* ✅ FIXED UI */
          <div className="flex flex-col items-center gap-3 text-primary">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            <span>Processing KYC & Decision...</span>
          </div>

        ) : !otpSent ? (
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="bg-primary text-white px-5 py-2 rounded"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};