import React from "react";
import axios from "axios";

const UploadComponent = () => {

  const handleClick = async () => {
    const res = await axios.post("http://localhost:3000/api/encodeImage", {
      name: "user",
      img: "lalala"
    });
    console.log(res);
    if (res && res.status === 200) {
      console.log('success');
    }
  }

  return (
    <div>
      Upload Image
      <button onClick={handleClick}> Send API </button>
    </div>
  );
}

export default UploadComponent;