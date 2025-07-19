import React from "react";
import Layout from "../components/Layout";

const Help = () => (
    <Layout title="❓ Help">
        <div className="max-w-2xl mx-auto px-6 py-10 bg-red rounded-xl shadow-lg">

            <h1 className="text-3xl font-semibold mb-4">Need Help?</h1>
            <p className="mb-6">Welcome to the GampusXP help center. Browse common topics or reach out for assistance.</p>

            <div className="space-y-4">
                <details className="collapse collapse-arrow ">
                    <summary className="collapse-title text-lg font-medium">What is GampusXP?</summary>
                    <div className="collapse-content">GampusXP gamifies academics—track assignments, achievements and progress with engaging features!</div>
                </details>
                <details className="collapse collapse-arrow ">
                    <summary className="collapse-title text-lg font-medium">How do I track assignments?</summary>
                    <div className="collapse-content">Go to your personal dashboard to view and manage assignments and schedule in real time.</div>
                </details>
                <details className="collapse collapse-arrow ">
                    <summary className="collapse-title text-lg font-medium">What are Aura Points?</summary>
                    <div className="collapse-content">Aura Points are rewards you earn for completing tasks and challenges, encouraging active participation.</div>
                </details>
                <details className="collapse collapse-arrow ">
                    <summary className="collapse-title text-lg font-medium">Who are coordinators?</summary>
                    <div className="collapse-content">Coordinators are platform admins who manage content and monitor activity.</div>
                </details>
                <details className="collapse collapse-arrow ">
                    <summary className="collapse-title text-lg font-medium">I need more help.</summary>
                    <div className="collapse-content">
                        Email <a className="text-blue-600 underline" href="mailto:support@gampusxp.com">support@gampusxp.com</a> or contact your academic coordinator.
                    </div>
                </details>
            </div>
        </div>
    </Layout>
);

export default Help;
