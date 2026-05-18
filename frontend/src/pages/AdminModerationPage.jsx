import { useEffect, useState } from 'react';
import Logo from '../components/branding/Logo.jsx';
import AdminReviewDashboard from '../components/moderation/AdminReviewDashboard.jsx';
import { getAdminReports } from '../services/moderationService.js';

export default function AdminModerationPage() {
  const [overview, setOverview] = useState({});
  const [reports, setReports] = useState([]);

  const loadData = async () => {
    try {
      const data = await getAdminReports();
      setOverview(data.overview || {});
      setReports(data.reports || []);
    } catch (error) {
      setOverview({});
      setReports([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex justify-start">
          <Logo compact />
        </div>
        <AdminReviewDashboard overview={overview} reports={reports} onRefresh={loadData} />
      </div>
    </main>
  );
}
