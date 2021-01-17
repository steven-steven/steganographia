import React from "react";
import { useState } from "react";
import FileSaver from 'file-saver';

const UploadComponent = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClick = async () => {
    const body = new FormData();

    body.append('file', selectedFile, selectedFile.name);

    //JSON obj
    body.append('stampData', JSON.stringify({ "id": 'idddd', "name": 'nameee' }));

    console.log(selectedFile);
    const res = await fetch("http://localhost:3000/api/encodeImage", {
      method: "POST",
      body
    });

    const blob = await res.blob();
    FileSaver.saveAs(blob, selectedFile.name);
  }

  const verifyClick = async () => {
    const body = new FormData();

    body.append('file', selectedFile, selectedFile.name);

    const res = await fetch("http://localhost:3000/api/verify", {
      method: "POST",
      body
    });
    //display result
    console.log(res);
  }

  return (
    <div>
      Upload Image
      <input type="file" onChange={onFileChange} />
      <button type="button" onClick={handleClick}>Submit</button>
      <button type="button" onClick={verifyClick}>Verify</button>
    </div>
  );
}

export default UploadComponent;