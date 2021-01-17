import React, { useState } from "react";

import axios from "axios";
import UploadComponent from "../atoms/uploadComponent";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    uploadedImage: "",
  });

  const hasNoErrors = () => {
    if (!formData.name) {
      alert("Please enter your name");
      return false;
    }
    if (!formData.email) {
      alert("Please enter your email");
      return false;
    }
    if (!formData.uploadedImage) {
      alert("Please upload an image");
      return false;
    }
    return true;
  };

  const handleUpload = (file) => {
    setFormData({ ...formData, uploadedImage: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasNoErrors() === false) return;

    let form = new FormData();
    form.append("myImage", formData.uploadedImage);
    form.append("name", formData.name);
    form.append("email", formData.email);

    axios({
      method: "post",
      url: "/api/incidents/upload",
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response.status);
      })
      .catch(function (response) {
        console.log(response.status);
      });
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

      <div className="mt-6 flex justify-between">
        <UploadComponent
          handleUpload={(e) => handleUpload(e.target.files[0])}
        />
        <div>
          <input
            type="submit"
            value="Submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};
export default FormComponent;
