import React from "react";
import Layout from "../components/Layout";

const Terms = () => (
  <Layout title="📄 Terms of Service">
    <div className="max-w-2xl mx-auto px-6 py-10 rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">Terms of Service</h1>
      <p className="mb-4">Please read these terms before using GampusXP:</p>
      <ul className="list-disc ml-6 mb-4">
        <li className="mb-2"><b>Usage:</b> GampusXP is for educational use. Do not misuse platform features for spam or cheating.</li>
        <li className="mb-2"><b>Account Security:</b> Keep your login info safe and do not share accounts with others.</li>
        <li className="mb-2"><b>Coordinator Authority:</b> Coordinators may manage content and accounts to ensure fair platform use.</li>
        <li className="mb-2"><b>Updates:</b> Terms may change as GampusXP grows; continued use means acceptance of these updates.</li>
        <li className="mb-2"><b>Contact:</b> For questions about these terms, reach out at <a href="mailto:support@gampusxp.com" className="text-blue-600 underline">support@gampusxp.com</a>.</li>
      </ul>
      <p className="text-sm text-gray-500 mt-8">© {new Date().getFullYear()} GampusXP. All rights reserved.</p>
    </div>
  </Layout>
);

export default Terms;
