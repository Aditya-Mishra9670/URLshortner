import React, { useState } from "react";
import AdminPage from "./Admin.jsx"; // Import Admin component

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Toggle between user and admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
  const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to shorten URL");

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          {isAdmin ? "Go to User Page" : "Go to Admin Page"}
        </button>
      </div>

      {isAdmin ? (
        <AdminPage />
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              placeholder="Enter your URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Shorten URL"}
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {shortUrl && (
            <div className="mt-6 text-center">
              <p className="text-gray-700">Your short URL:</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
