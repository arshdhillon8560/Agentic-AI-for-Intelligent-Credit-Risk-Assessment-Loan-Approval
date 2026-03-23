const BASE_URL = "http://localhost:5000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const authAPI = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

export const officerAPI = {
  getEscalated: async () => {
    const res = await fetch(`${BASE_URL}/officer/escalated`, {
      headers: getHeaders()
    });
    return res.json();
  },

  getDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/officer/application/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  updateDecision: async (data) => {
    const res = await fetch(`${BASE_URL}/officer/decision`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }
};