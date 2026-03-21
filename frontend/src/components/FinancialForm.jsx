import { useState } from 'react';

export const FinancialForm = ({ onSubmit, loading, applicationId }) => {
  const [formData, setFormData] = useState({
    existing_loans: '',
    existing_emi: '',
    credit_card_limit: '',
    credit_card_balance: '',
    bank_name: '',
    bank_account_type: '',
    bank_account_number: '',
    average_monthly_balance: ''
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
      application_id: applicationId,
      ...formData,
      existing_loans: parseInt(formData.existing_loans),
      existing_emi: parseFloat(formData.existing_emi),
      credit_card_limit: parseFloat(formData.credit_card_limit),
      credit_card_balance: parseFloat(formData.credit_card_balance),
      average_monthly_balance: parseFloat(formData.average_monthly_balance)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Existing Loans</label>
          <input
            type="number"
            name="existing_loans"
            value={formData.existing_loans}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Existing EMI</label>
          <input
            type="number"
            name="existing_emi"
            value={formData.existing_emi}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Credit Card Limit</label>
          <input
            type="number"
            name="credit_card_limit"
            value={formData.credit_card_limit}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Credit Card Balance</label>
          <input
            type="number"
            name="credit_card_balance"
            value={formData.credit_card_balance}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bank Account Type</label>
          <select
            name="bank_account_type"
            value={formData.bank_account_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Bank Account Number</label>
          <input
            type="text"
            name="bank_account_number"
            value={formData.bank_account_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Average Monthly Balance</label>
          <input
            type="number"
            name="average_monthly_balance"
            value={formData.average_monthly_balance}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 mt-6"
      >
        {loading ? 'Saving...' : 'Save Financial Details'}
      </button>
    </form>
  );
};
