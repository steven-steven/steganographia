import React from "react";
import axios from "axios";
import _ from "lodash";

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */
const UploadComponent = ({ handleUpload, fileData }) => {
  const handleFileSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("myImage", fileData);
    formData.append("name", "Steven Xiong");
    formData.append("email", "steven.x@waterloop.ca");

    axios({
      method: "post",
      url: "/api/incidents/upload",
      data: formData,
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
    <div className="mt-6 flex justify-between">
      <div>
        <input
          type="file"
          name="myImage"
          accept="image/*"
          onChange={handleUpload}
        />
      </div>
      <div>
        <input
          type="submit"
          value="Submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleFileSubmit}
        />
      </div>
    </div>
  );
};

export default UploadComponent;
