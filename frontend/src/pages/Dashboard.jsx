import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Layout from '../components/Layout.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { SkeletonStatRow, SkeletonBlock } from '../components/Skeleton.jsx';
import api from '../api/client.js';

const CHART_COLORS = ['#2DD4BF', '#F5A623', '#F85149', '#8B949E', '#5B8DEF'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard data. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const totalAssets = data
    ? Object.values(data.statusCounts).reduce((a, b) => a + b, 0)
    : 0;

  const categoryData = data
    ? Object.entries(data.categoryCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <Layout>
      <div className="p-8 max-w-6xl">
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted text-sm mb-8">Real-time view of every asset across the org.</p>

        {error && (
          <div className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading && (
          <>
            <SkeletonStatRow />
            <div className="grid grid-cols-3 gap-6">
              <div className="asset-tag p-6 pl-8 col-span-1">
                <SkeletonBlock className="h-3 w-24 mb-4" />
                <SkeletonBlock className="h-44 w-full" />
              </div>
              <div className="asset-tag p-6 pl-8 col-span-2">
                <SkeletonBlock className="h-3 w-32 mb-4" />
                <SkeletonBlock className="h-44 w-full" />
              </div>
            </div>
          </>
        )}

        {!loading && data && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard label="Total assets" value={totalAssets} />
              <StatCard label="Available" value={data.statusCounts.available || 0} accent="teal" />
              <StatCard label="Allocated" value={data.statusCounts.allocated || 0} accent="amber" />
              <StatCard label="In maintenance" value={data.statusCounts.maintenance || 0} accent="danger" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="asset-tag p-6 pl-8 col-span-1">
                <h2 className="text-sm font-semibold mb-4 font-mono uppercase text-muted">By category</h2>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#161B22', border: '1px solid #2A3242', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted text-sm">No assets yet.</p>
                )}
              </div>

              <div className="asset-tag p-6 pl-8 col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold font-mono uppercase text-muted">Upcoming maintenance</h2>
                  {data.overdueMaintenance > 0 && (
                    <span className="text-xs text-danger font-mono">{data.overdueMaintenance} overdue</span>
                  )}
                </div>
                {data.upcomingMaintenance.length === 0 ? (
                  <p className="text-muted text-sm">Nothing scheduled. All clear.</p>
                ) : (
                  <ul className="space-y-3">
                    {data.upcomingMaintenance.map((m) => (
                      <li key={m._id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-mono text-xs text-muted mr-2">{m.asset?.assetTag}</span>
                          {m.asset?.name}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted text-xs">
                            {new Date(m.scheduledDate).toLocaleDateString()}
                          </span>
                          <StatusPill status={m.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ label, value, accent }) {
  const accentColor = { teal: '#2DD4BF', amber: '#F5A623', danger: '#F85149' }[accent] || '#E6EDF3';
  return (
    <div className="asset-tag p-5 pl-7">
      <div className="text-xs text-muted font-mono uppercase mb-2">{label}</div>
      <div className="text-3xl font-display font-semibold" style={{ color: accentColor }}>
        {value}
      </div>
    </div>
  );
}
