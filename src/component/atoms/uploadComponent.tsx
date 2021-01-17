import React from "react";
import _ from "lodash";

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */
const UploadComponent = ({ handleUpload }) => {
  return (
    <div>
      <input
        type="file"
        name="myImage"
        accept="image/*"
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadComponent;
