import React, { useState } from "react";
import UploadComponent from "../atoms/uploadComponent";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    uploadedImage: "",
  });

  const handleUpload = (file) => {
    setFormData({ ...formData, uploadedImage: file });
  };

  return (
    <form method="POST" encType="multipart/form-data">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="name"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Name"
          />
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
      </div>
      <UploadComponent
        handleUpload={(e) => handleUpload(e.target.files[0])}
        fileData={formData.uploadedImage}
      />
    </form>
  );
};
export default FormComponent;
