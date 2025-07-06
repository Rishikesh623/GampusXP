import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useToast } from '../components/ToastProvider';
import OverlayLoader from '../components/OverlayLoader';

const ActivityPage = ({ userId }) => {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/user/activity?page=${currentPage}`,
                    { withCredentials: true }
                );
                setActivities(res.data.activities || []);
                setTotalPages(res.data.pages || 1);
            } catch (err) {
                console.error("Activity fetch failed:", err);
                if (err?.response?.status === 404) return;
                showToast({
                    message: err.response?.data?.message || "Unable to fetch activities.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [currentPage, userId]);

    return (
        <Layout title="📜 User Activity">
            <OverlayLoader loading={loading}>
                <div className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
                    {activities.length === 0 ? (
                        <p className="text-center text-gray-500 italic p-6 text-base">
                            No activities found.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {activities.map((act) => (
                                <div
                                    key={act._id}
                                    className="grid grid-cols-12 gap-x-4 items-center px-6 py-3 text-base text-gray-800"
                                >
                                    <span className="col-span-2">
                                        <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full border border-primary/30">
                                            {act.tag}
                                        </span>
                                    </span>
                                    <span className="col-span-7 leading-relaxed">{act.message}</span>
                                    <span className="col-span-3 text-right text-sm text-gray-500">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {activities.length > 0 && (
                    <div className="flex justify-end items-center gap-4 mt-6">
                        <button
                            className="btn btn-outline btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            ◀ Prev
                        </button>
                        <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn btn-outline btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            Next ▶
                        </button>
                    </div>
                )}
            </OverlayLoader>
        </Layout>
    );
};

export default ActivityPage;
