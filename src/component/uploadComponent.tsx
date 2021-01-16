import React from "react";
import axios from "axios";

import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import XHRUpload from "@uppy/xhr-upload";

/**
 * Credits go to https://maxcode.online/nextjs-file-upload-with-uppy-and-multer-using-api-routes/
 */

const uppy = new Uppy({
  meta: { type: "img" },
  restrictions: {
    maxFileSize: 1048576 * 20,
    allowedFileTypes: [".jpg", ".jpeg", ".png"],
  },
  autoProceed: true,
});

uppy.use(XHRUpload, {
  endpoint: "/api/incidents/upload",
  fieldName: "img",
  formData: true,
});

uppy.on("complete", (result) => {
  const url = result.successful[0].uploadURL;
  console.log("successful upload", result);
  console.log(url);
});

uppy.on("error", (error) => {
  console.error(error.stack);
});

uppy.on("restriction-failed", (file, error) => {
  const err = error.stack.includes("exceeds maximum allowed size of 4 MB")
    ? "A fájl mérete nagyobb mint 4MB"
    : error;

  alert(
    `Feltöltési hiba: ${err}\n${file.name} Mérete : ${Math.round(
      file.size / 1024 / 1024
    )}MB`
  );
});

const handleClick = async () => {
  const res = await axios.post("http://localhost:3000/api/encodeImage", {
    name: "user",
    img: "lalala",
  });
  console.log(res);
  if (res && res.status === 200) {
    console.log("success");
  }
};

const UploadComponent = () => {
  return (
    <div>
      <DragDrop
        uppy={uppy}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: "Húzd ide a képet vagy %{browse}",
            // Used as the label for the link that opens the system file selection dialog.
            browse: "Upload Image",
          },
        }}
      />
      <button onClick={handleClick}> Send API </button>
    </div>
  );
};

export default UploadComponent;
