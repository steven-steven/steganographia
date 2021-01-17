import React, { useState } from "react";
import UploadComponent from "../atoms/uploadComponent";
import { ImSpinner } from 'react-icons/im';

type data = {
  name: string,
  message: string,
  date: string
}
type error = {
  error: string
}
const FormComponent = () => {
  const [formData, setFormData] = useState({
    uploadedImage: null,
    name: '',
    message: '',
    date: '',
    error: '',
  });
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasNoErrors = () => {
    if (!formData.uploadedImage) {
      alert("Please upload an image");
      return false;
    }
    return true;
  };

  const handleUpload = (file) => {
    setFormData({ ...formData, uploadedImage: file });
    setFetchSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasNoErrors() === false) return;

    let form = new FormData();
    form.append("file", formData.uploadedImage, formData.uploadedImage.name);

    setIsLoading(true);
    const res = await fetch("/api/verify", {
      method: "POST",
      body: form
    });
    const userData = await res.json();
    setIsLoading(false);

    console.log(userData.error);
    setFormData({ ...formData, name: userData.name, message: userData.message, date: userData.date, error: userData.error });
    if (!userData.error) setFetchSuccess(true);
    else setFetchSuccess(false);
  };

  return (
    <>
      <form method="POST" encType="multipart/form-data">
        <div className="rounded-md shadow-sm">
          <p className='mb-4 text-2xl font-light text-center'>Verify</p>

          <div className="flex justify-between mt-6 center">
            <UploadComponent
              handleUpload={(e) => handleUpload(e.target.files[0])}
            />
          </div>

          {isLoading ? (<ImSpinner className='mx-auto mt-8 text-4xl animate-spin' />) :
            (
              <div className="flex justify-between w-full mt-8">
                <input
                  type="submit"
                  value="Submit"
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={handleSubmit}
                />
              </div>
            )
          }

        </div>
      </form>
      <div className="text-center">
        {formData.error &&
          (<div className="pt-8 mt-8 border-t-4">
            <p className='text-xl text-red-700'>! Unable to verify the image</p>
          </div>)
        }
        {fetchSuccess && (<div className="pt-8 mt-8 border-t-4">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-xl font-medium leading-6 text-green-700">
                Stored Data
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500">
                Retrieved Information from your image
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Author Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formData.name}
                  </dd>
                </div>
                <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Message
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formData.message}
                  </dd>
                </div>
                <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formData.date}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>)}
      </div>
    </>
  );
};
export default FormComponent;
