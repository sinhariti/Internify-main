import React, { useState } from 'react';

const ResumeUpload = ({ applicationId, token }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/upload-resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setUploadStatus('Resume uploaded successfully');
      } else {
        const err = await response.text();
        setUploadStatus('Upload failed: ' + err);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('Upload failed: Network error');
    }
  };

  return (
    <div className="p-4 border rounded shadow w-fit space-y-2">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} className="bg-green-600 text-white px-4 py-2 rounded">
        Upload Resume
      </button>
      {uploadStatus && <p className="text-sm">{uploadStatus}</p>}
    </div>
  );
};

export default ResumeUpload;