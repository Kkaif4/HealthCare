export const cleanGeminiResponse = (plan) => {
  let newplan = plan
    .replace(/^```html\s*/, "")
    .replace(/```$/, "")
    .replace(/\n/g, "")
    .trim();
  return newplan;
};
