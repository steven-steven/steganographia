import React from "react";
import axios from "axios";

import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import XHRUpload from "@uppy/xhr-upload";

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */
const UploadComponent = ({ handleUpload, fileData }) => {
  const handleFileSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();

    console.log("Form Data");
    console.log(fileData);

    formData.append("name", "Steven Xiong");
    formData.append("email", "steven.x@waterloop.ca");
    formData.append("uploadedImage", fileData);

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
    <div>
      <input
        type="file"
        name="myImage"
        accept="image/*"
        onChange={handleUpload}
      />
      <input type="submit" value="Upload Photo" onClick={handleFileSubmit} />
    </div>
  );
};

export default UploadComponent;
