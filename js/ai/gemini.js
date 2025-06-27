  /**
   * WARNING: Never expose your Gemini API key in production frontend code!
   * This is for prototype/testing only. Move to a backend for real deployments.
   */

  const GEMINI_API_KEY = "AIzaSyCwo1wnJOOmsKP0SDqhWzAqlqWTbJS9XsU";

  // Gemini 2.5 Pro (AI Studio) corresponds to gemini-1.5-pro in API
  const GEMINI_MODEL = "gemini-1.5-pro"; // Use "chat-bison-001" only if needed

  window.geminiSendMessage = async function(userMessage) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

      const body = {
          contents: [
              {
                  parts: [{ text: userMessage }]
              }
          ]
      };

      try {
          const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
          });

          if (!res.ok) {
              const errText = await res.text();
              console.error("Gemini API error:", res.status, errText);

              switch (res.status) {
                  case 404:
                      return `Model not found (404). If you're using Gemini 2.5 Pro in AI Studio, use model ID: 'gemini-1.5-pro'.`;
                  case 401:
                  case 403:
                      return "Authentication error (401/403). Check if your API key is valid and has access to Gemini.";
                  case 429:
                      return "Quota exceeded (429). Your usage limit may be reached.";
                  case 400:
                      return "Bad request (400). There might be an issue with the format or content of your request.";
                  default:
                      return `Unexpected Gemini API error (${res.status}): ${errText}`;
              }
          }

          const data = await res.json();
          console.log("Gemini API response:", data);

          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!reply) {
              return "Gemini returned no usable reply. Full response: " + JSON.stringify(data);
          }

          return reply;

      } catch (err) {
          console.error("Gemini fetch error:", err);

          if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
              return "Network error or CORS issue. If running locally, try using a local server instead of opening index.html via file://.";
          }

          return "Unexpected error while contacting Gemini: " + err.message;
      }
  };
