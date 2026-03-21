import { useState } from 'react';

export const ApplicationForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    loan_amount: '',
    loan_tenure: '',
    loan_purpose: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      loan_amount: parseFloat(formData.loan_amount),
      loan_tenure: parseInt(formData.loan_tenure),
      loan_purpose: formData.loan_purpose
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Loan Amount
        </label>
        <input
          type="number"
          name="loan_amount"
          value={formData.loan_amount}
          onChange={handleChange}
          required
          placeholder="800000"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Loan Tenure (months)
        </label>
        <input
          type="number"
          name="loan_tenure"
          value={formData.loan_tenure}
          onChange={handleChange}
          required
          placeholder="48"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Loan Purpose
        </label>
        <select
          name="loan_purpose"
          value={formData.loan_purpose}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Select Purpose</option>
          <option value="Home Loan">Home Loan</option>
          <option value="Personal Loan">Personal Loan</option>
          <option value="Business Loan">Business Loan</option>
          <option value="Education Loan">Education Loan</option>
          <option value="Vehicle Loan">Vehicle Loan</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Application'}
      </button>
    </form>
  );
};
