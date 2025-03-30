import React, { useState } from "react";
import axios from "axios";

function App() {
  console.log("App component rendered");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select a valid image file.");
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error);
      setResult("Error occurred while processing the image.");
    } finally {
      setFile(null); // Reset the file input after submission
      setPreview(null); // Reset the preview image
      document.querySelector('input[type="file"]').value = ""; // Clear the file input
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chest X-ray Classification</h1>
      <form onSubmit={handleSubmit} className="text-center">
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        {preview && (
          <div className="mb-3">
            <h5>Image Preview:</h5>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Classify
        </button>
      </form>
      {result && (
        <div className="mt-4 text-center">
          <h2>Prediction Result:</h2>
          <p className="alert alert-info">{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;