const API_BASE_URL = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}` // ✅ always include
  };
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ================= AUTH =================
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  }
};

// ================= APPLICATION =================
export const applicationAPI = {
  create: async (applicationData) => {
    const response = await fetch(`${API_BASE_URL}/application/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  saveProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/application/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  saveEmployment: async (employmentData) => {
    const response = await fetch(`${API_BASE_URL}/application/employment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employmentData)
    });
    return handleResponse(response);
  },

  saveFinancial: async (financialData) => {
    const response = await fetch(`${API_BASE_URL}/application/financial`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(financialData)
    });
    return handleResponse(response);
  },

  uploadDocuments: async (formData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/application/upload-documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    return handleResponse(response);
  },

  getStatus: async (applicationId) => {
    const response = await fetch(
      `${API_BASE_URL}/application/status/${applicationId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  // ✅ FIXED (IMPORTANT)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/application/all`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }
};

// ================= KYC =================
export const kycAPI = {
  verifyPAN: async (panData) => {
    const response = await fetch(`${API_BASE_URL}/kyc/verify-pan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(panData)
    });
    return handleResponse(response);
  },

  sendOTP: async (aadhaarData) => {
    const response = await fetch(`${API_BASE_URL}/kyc/aadhaar/send-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(aadhaarData)
    });
    return handleResponse(response);
  },

  verifyOTP: async (otpData) => {
    const response = await fetch(`${API_BASE_URL}/kyc/aadhaar/verify-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(otpData)
    });
    return handleResponse(response);
  }
};