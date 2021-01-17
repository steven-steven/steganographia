import React, { useState } from "react";
import FileSaver from 'file-saver';
import axios from "axios";
import UploadComponent from "../atoms/uploadComponent";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    uploadedImage: null,
  });

  const hasNoErrors = () => {
    if (!formData.name) {
      alert("Please enter your name");
      return false;
    }
    if (!formData.message) {
      alert("Please enter your message");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasNoErrors() === false) return;

    let form = new FormData();
    form.append("file", formData.uploadedImage, formData.uploadedImage.name);

    //JSON obj
    form.append('stampData', JSON.stringify({ "name": formData.name, "message": formData.message }));

    const res = await fetch("/api/encodeImage", {
      method: "POST",
      body: form
    });

    const blob = await res.blob();

    // const blob = await res.blob();
    FileSaver.saveAs(blob, formData.uploadedImage.name);
  };

  return (
    <form method="POST" encType="multipart/form-data">
      <div className="-space-y-px rounded-md shadow-sm center">
        <p className='mb-4 text-2xl font-light text-center'>Stamp your image</p>
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
            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Name"
          />
        </div>

        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <input
            id="message"
            name="message"
            type="text"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            autoComplete="message"
            required
            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Message"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <UploadComponent
          handleUpload={(e) => handleUpload(e.target.files[0])}
        />
        <div>
          <input
            type="submit"
            value="Submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};
export default FormComponent;
