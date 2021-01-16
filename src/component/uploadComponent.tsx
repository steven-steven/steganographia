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
  const handleFileSubmit = () => {
    const formData = new FormData();

    console.log("Form Data");
    console.log(fileData);

    formData.append("uploadedImage", fileData);
    axios.post("api/incidents/upload", formData);
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
