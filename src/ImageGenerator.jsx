import React, { useState } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

  const models = [
    {
      name: "Flux",
      api: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    },
    {
      name: "Diffusion V-4",
      api: "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
    },
    {
      name: "Diffusion XL Base",
      api: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    },
  ];

  const generateImage = async () => {
    if (!selectedModel) {
      setError("Please select a model.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        selectedModel,
        { inputs: prompt },
        {
          responseType: "blob",
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      );

      const imageBlob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setHistory((prevHistory) => [...prevHistory, { prompt, imageUrl }]);
    } catch (err) {
      setError("Error generating image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated_image.jpg"; // Set the default file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-blue-600">
        Image Generator
      </h1>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="" disabled>
            Select a model
          </option>
          {models.map((model, index) => (
            <option key={index} value={model.api}>
              {model.name}
            </option>
          ))}
        </select>

        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Image"
          )}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {imageUrl && !loading && (
          <div className="mt-6">
            <img
              src={imageUrl}
              alt="Generated"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            <button
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-500 transition duration-200"
              onClick={downloadImage}
            >
              Download Image
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">History</h2>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500">No history yet.</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition duration-200"
              >
                <p className="font-semibold text-gray-800">{item.prompt}</p>
                <img
                  src={item.imageUrl}
                  alt={`Generated for: ${item.prompt}`}
                  className="max-w-full h-auto mt-2 rounded-lg"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
