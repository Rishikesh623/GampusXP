import React from "react";
import Layout from "../components/Layout";

const Privacy = () => (
  <Layout title="🔒 Privacy Policy">
    <div className="max-w-2xl mx-auto px-6 py-10 rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
      <p className="mb-6">Last Updated: July 2025</p>
      <ul className="list-disc ml-6 mb-4 ">
        <li className="mb-2"><b>Information We Collect:</b> GampusXP stores your account info, registration number, assignments, and activity stats to offer personalized dashboards.</li>
        <li className="mb-2"><b>How We Use Data:</b> We provide gamified academic features, enable coordinators to assist users, and power achievements and analytics.</li>
        <li className="mb-2"><b>Data Security:</b> All sensitive info is encrypted. Only authorized platform staff can access personal data.</li>
        <li className="mb-2"><b>No Ads or Selling:</b> GampusXP never shares or sells your information to advertisers or unrelated third parties.</li>
        <li className="mb-2"><b>Your Rights:</b> To access, update, or delete your information, contact your coordinator or <a href="mailto:support@gampusxp.com" className="text-blue-600 underline">support@gampusxp.com</a>.</li>
      </ul>
      <p className="text-sm mt-8">This policy may change; check back regularly for updates.</p>
    </div>
  </Layout>
);

export default Privacy;
