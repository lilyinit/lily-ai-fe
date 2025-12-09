"use client";

import { useState } from "react";

// --- Type Definitions ---
// Defines the structure of the data expected from the backend API response
interface SummaryResponse {
  summary: string;
  original_length: number;
}

// Defines the expected structure for an API error response
interface ErrorResponse {
  error: string;
}

// --- Constants ---
// Get the backend API URL from the environment variables (set in .env.local)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
// Append the specific summarize endpoint path
const SUMMARIZE_ENDPOINT = `${API_URL}/summarize`;

export default function Home() {
  // State variables, explicitly typed
  const [documentText, setDocumentText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentText) {
      alert("Please enter text to summarize.");
      return;
    }

    // Check if API URL is configured (critical for production)
    if (!API_URL) {
      setError(
        "Backend API URL is not configured. Check your .env.local file."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(""); // Clear previous summary

    try {
      const response = await fetch(SUMMARIZE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the document text as JSON in the request body
        body: JSON.stringify({ document_text: documentText }),
      });

      // Parse the JSON response
      const data: SummaryResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        // Handle HTTP errors and type assertion for error response
        const errorMessage =
          (data as ErrorResponse).error || "Unknown server error.";
        throw new Error(errorMessage);
      }

      // Success: Type assertion for success response
      setSummary((data as SummaryResponse).summary);
    } catch (err: any) {
      console.error("API Error:", err);
      // Display specific error message or a generic one
      setError(
        `An error occurred: ${
          err.message || "Could not connect to the backend API."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700">
          Lily AI Summarizer Gateway (TS)
        </h1>
        <p className="text-gray-600 mt-2">
          Submit long text to get a concise summary powered by OpenAI and GCP
          Cloud Run.
        </p>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            rows={10}
            placeholder="Paste your document text here..."
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300"
            disabled={isLoading}
          >
            {isLoading ? "Summarizing..." : "Summarize Document"}
          </button>
        </form>

        {/* Display Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Display Summary Result */}
        {summary && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Summary Result
            </h2>
            <div className="p-4 bg-green-50 border border-green-300 text-gray-800 rounded-lg whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
