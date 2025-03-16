import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your information.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal information you provide (name, email, etc.).</li>
        <li>Usage data collected automatically.</li>
        <li>Cookies and tracking technologies.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use your information to provide, improve, and secure our services.
      </p>

      <h2 className="text-xl font-semibold mt-4">3. Data Protection</h2>
      <p className="mb-4">
        We implement security measures to protect your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-4">4. Contact Us</h2>
      <p className="mb-4">
        If you have any questions, reach out to us at support@example.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
