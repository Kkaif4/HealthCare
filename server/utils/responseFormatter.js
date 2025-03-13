export const cleanGeminiResponse = (responseText) => {
  if (typeof responseText !== "string") {
    console.error("Error: responseText is not a string:", responseText);
    return ""; // Or handle the error appropriately
  }

  // ... your cleaning logic ...
  let cleanedText = responseText.replace(/<[^>]*>/g, "");
  cleanedText = cleanedText.replace(/\s+/g, " ").trim();
  cleanedText = cleanedText.replace(/\n+/g, "<br>");

  return cleanedText;
};
