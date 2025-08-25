import React, { useEffect, useState } from "react";

function AdminPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/urls");
        if (!response.ok) throw new Error("Failed to fetch URLs");
        const data = await response.json();
        setUrls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {loading && <p className="text-center">Loading URLs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && urls.length === 0 && (
          <p className="text-center text-gray-500">No URLs found.</p>
        )}

        {!loading && urls.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border border-gray-300 px-4 py-2">Original URL</th>
                  <th className="border border-gray-300 px-4 py-2">Short URL</th>
                  <th className="border border-gray-300 px-4 py-2">Clicks</th>
                  <th className="border border-gray-300 px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 truncate max-w-xs">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {url.shortUrl}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {url.visitCount}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                      {new Date(url.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
