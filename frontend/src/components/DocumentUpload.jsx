import { useState } from 'react';
import { Upload } from 'lucide-react';

export const DocumentUpload = ({ onSubmit, loading, applicationId }) => {
  const [files, setFiles] = useState({
    bank_statement: null,
    salary_slip: null,
    itr_document: null
  });

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles({
      ...files,
      [name]: fileList[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('application_id', applicationId);

    if (files.bank_statement) {
      formData.append('bank_statement', files.bank_statement);
    }
    if (files.salary_slip) {
      formData.append('salary_slip', files.salary_slip);
    }
    if (files.itr_document) {
      formData.append('itr_document', files.itr_document);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-sky-500 transition-colors">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 mb-1">Bank Statement</span>
            <span className="text-xs text-slate-500 mb-2">
              {files.bank_statement ? files.bank_statement.name : 'Click to upload'}
            </span>
            <input
              type="file"
              name="bank_statement"
              onChange={handleFileChange}
              required
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-sky-500 transition-colors">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 mb-1">Salary Slip</span>
            <span className="text-xs text-slate-500 mb-2">
              {files.salary_slip ? files.salary_slip.name : 'Click to upload'}
            </span>
            <input
              type="file"
              name="salary_slip"
              onChange={handleFileChange}
              required
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-sky-500 transition-colors">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 mb-1">ITR Document</span>
            <span className="text-xs text-slate-500 mb-2">
              {files.itr_document ? files.itr_document.name : 'Click to upload'}
            </span>
            <input
              type="file"
              name="itr_document"
              onChange={handleFileChange}
              required
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Documents'}
      </button>
    </form>
  );
};
