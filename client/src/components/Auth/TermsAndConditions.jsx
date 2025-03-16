import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to our website. By using our services, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing and using our platform, you accept and agree to be bound by these terms.
      </p>

      <h2 className="text-xl font-semibold mt-4">2. User Responsibilities</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You must be at least 18 years old to use our services.</li>
        <li>Do not engage in any unlawful activities on the platform.</li>
        <li>Maintain confidentiality of your account credentials.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4">3. Intellectual Property</h2>
      <p className="mb-4">
        All content on this website, including text, images, and design, is owned by us and may not be copied without permission.
      </p>

      <h2 className="text-xl font-semibold mt-4">4. Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for any damages resulting from your use of our services.
      </p>

      <h2 className="text-xl font-semibold mt-4">5. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Continued use of our services means you accept the new terms.
      </p>

      <p className="mt-6">
        For more details, read our{" "}
        <Link to="/privacy-policy" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
