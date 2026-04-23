import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, 
  AreaChart, Area, 
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Sparkles } from 'lucide-react';
import WelcomeIllustration from '../components/WelcomeIllustration';

const API_URL = 'http://localhost:3000/api';

export default function Insights() {
  const [viewState, setViewState] = useState('empty');
  const [insightsData, setInsightsData] = useState(null);

  const handleGenerate = async () => {
    setViewState('loading');
    try {
      const res = await fetch(`${API_URL}/insights`);
      const data = await res.json();
      if (data.success) {
        setInsightsData(data.data);
        setViewState('content');
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setViewState('empty');
    }
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const revenueData = insightsData?.revenueTrend?.map(row => ({
    month: new Date(row.month).toLocaleString('default', { month: 'short' }),
    value: parseFloat(row.revenue) || 0
  })) || [];

  const segmentationData = [
    { name: 'Enterprise', value: 0, color: '#4f46e5' },
    { name: 'Pro', value: 0, color: '#06b6d4' },
    { name: 'Starter', value: 0, color: '#f59e0b' },
  ];

  if (insightsData?.churnDistribution) {
    insightsData.churnDistribution.forEach(row => {
      if (row.churn_risk === 'Healthy') segmentationData[2].value = parseInt(row.count);
      else if (row.churn_risk === 'Moderate') segmentationData[1].value = parseInt(row.count);
      else if (row.churn_risk === 'High') segmentationData[0].value = parseInt(row.count);
    });
  }

  const churnRiskData = [
    { segment: 'Low Usage', rate: 12 },
    { segment: 'Billing Issues', rate: 8 },
    { segment: 'Support Delays', rate: 18 },
    { segment: 'Competitor Risk', rate: 5 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Insights</h1>
      </div>

      {viewState === 'empty' && (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[500px]">
          <div className="max-w-md text-center p-8">
            <div className="flex justify-center mb-8 mix-blend-multiply">
              <WelcomeIllustration className="w-64 h-auto opacity-90" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No insights available yet</h2>
            <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">
              Connect data or run analysis to generate insights. Our AI will automatically segment your user base and highlight churn risks.
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[15px] font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Generate Insights
            </button>
          </div>
        </div>
      )}

      {viewState === 'loading' && (
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
              <div className="w-1/3 h-5 bg-slate-200 animate-pulse rounded mb-6"></div>
              <div className="w-full h-[250px] bg-slate-100 animate-pulse rounded-lg"></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
              <div className="w-1/3 h-5 bg-slate-200 animate-pulse rounded mb-6"></div>
              <div className="w-full h-[250px] bg-slate-100 animate-pulse rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
            <div className="w-1/4 h-5 bg-slate-200 animate-pulse rounded mb-6"></div>
            <div className="w-full h-[300px] bg-slate-100 animate-pulse rounded-lg flex items-end gap-4 p-4">
              <div className="w-full h-1/3 bg-slate-200 rounded"></div>
              <div className="w-full h-2/3 bg-slate-200 rounded"></div>
              <div className="w-full h-1/2 bg-slate-200 rounded"></div>
              <div className="w-full h-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {viewState === 'content' && (
        <div className="flex-1 space-y-6 fade-in">
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-indigo-900 mb-1">Analysis Complete</h3>
                <p className="text-sm text-indigo-800/80">3 actionable segments identified. Enterprise accounts are driving 60% of revenue, but Support Delays are severely impacting retention.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden flex flex-col">
              <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Revenue Insights (Forecast)</h3>
              <div className="h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden flex flex-col">
              <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Customer Segmentation</h3>
              <div className="h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentationData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {segmentationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-slate-900">Churn Prediction Risk</h3>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">High Risk Matrix</span>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnRiskData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="segment" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="rate" fill="#f43f5e" radius={[0, 4, 4, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
