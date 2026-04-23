import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, AlertTriangle, Bell, X, TrendingUp, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import WelcomeIllustration from '../components/WelcomeIllustration';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const API_URL = 'http://localhost:3000/api';

function TooltipBadge({ children, reason }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {reason}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [highRiskCustomers, setHighRiskCustomers] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, insightsRes, highRes, alertsRes] = await Promise.all([
          fetch(`${API_URL}/dashboard`),
          fetch(`${API_URL}/insights`),
          fetch(`${API_URL}/customers?risk=High`),
          fetch(`${API_URL}/alerts/recent`)
        ]);
        
        const dashData = await dashRes.json();
        const insightsData = await insightsRes.json();
        const highData = await highRes.json();
        const alertsData = await alertsRes.json();
        
        if (dashData.success) setDashboardData(dashData.data);
        if (insightsData.success) setInsights(insightsData.data);
        
        if (highData.success) {
          const withHealthPredictions = await Promise.all(
            highData.data.slice(0, 5).map(async (c) => {
              try {
                const healthRes = await fetch(`${API_URL}/customers/${c.id}/health`);
                const healthData = await healthRes.json();
                return {
                  id: c.id,
                  name: c.name,
                  plan: c.plan,
                  usage: c.usage,
                  health_score: c.health_score,
                  churn_risk: c.churn_risk,
                  nps_score: c.nps_score,
                  open_tickets: c.open_tickets,
                  insight: healthData.success ? healthData.data : null
                };
              } catch {
                return { id: c.id, name: c.name, churn_risk: c.churn_risk };
              }
            })
          );
          setHighRiskCustomers(withHealthPredictions);
        }
        
        if (alertsData.success) setAlerts(alertsData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    fetch(`${API_URL}/alerts/${alertId}/read`, { method: 'PATCH' });
  };

  const activeAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));

  const revenueData = insights?.revenueTrend?.slice(-6).map(item => ({
    month: new Date(item.month).toLocaleString('default', { month: 'short' }),
    value: Number(item.revenue) || 0
  })) || [];

  const colorMap = { 'Healthy': '#10b981', 'Moderate': '#f59e0b', 'High': '#ef4444' };
  const healthData = insights?.churnDistribution?.map(item => ({
    name: item.churn_risk,
    value: Number(item.count),
    color: colorMap[item.churn_risk] || '#94a3b8'
  })) || [];

  const getRiskReason = (c) => {
    const reasons = [];
    if (c.usage < 30) reasons.push('Low usage');
    if (c.nps_score < 50) reasons.push('Low NPS');
    if (c.open_tickets > 0) reasons.push(`${c.open_tickets} open ticket(s)`);
    return reasons.length > 0 ? reasons.join(' + ') : 'Multiple factors';
  };

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r from-indigo-50 to-white rounded-2xl shadow-sm overflow-hidden relative transition-all duration-500 ${isScrolled ? 'max-h-0 opacity-0 !mb-0' : 'max-h-[160px] opacity-100 mb-6 border border-indigo-100'}`}>
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-slate-900">Good morning, Alex</h2>
            <p className="text-slate-600 text-[15px]">Here is your customer success overview</p>
          </div>
          <WelcomeIllustration className="w-40 h-auto opacity-90" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-slate-900">Dashboard</h1>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map(alert => (
            <div key={alert.id} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
              alert.severity === 'critical' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                <span className="text-sm font-medium text-slate-700">{alert.message}</span>
              </div>
              <button onClick={() => dismissAlert(alert.id)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900">{loading ? '...' : dashboardData?.total_customers ?? 0}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500 mb-1">Avg Health Score</p>
              <h3 className="text-3xl font-bold text-slate-900">{loading ? '...' : parseFloat(dashboardData?.avg_health_score ?? 0).toFixed(1)}<span className="text-lg text-slate-400">/100</span></h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg"><Activity className="w-5 h-5 text-emerald-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500 mb-1">Churn Rate</p>
              <h3 className="text-3xl font-bold text-slate-900">{loading ? '...' : parseFloat(dashboardData?.churn_rate ?? 0).toFixed(1) + '%'}</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-600" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Revenue Trend</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}/>
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Health Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {healthData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {healthData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] font-semibold text-slate-900">High Risk Customers - Action Required</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            Requires Attention
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {highRiskCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No high-risk customers</div>
          ) : highRiskCustomers.map(customer => (
            <div key={customer.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/customers/${customer.id}`} className="font-semibold text-[14px] text-slate-900 hover:text-indigo-600">
                    {customer.name}
                  </Link>
                  <p className="text-xs text-slate-500">{customer.plan} • Usage: {customer.usage}%</p>
                </div>
                <TooltipBadge reason={getRiskReason(customer)}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                    {customer.churn_risk}
                  </span>
                </TooltipBadge>
              </div>

              {customer.insight && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-semibold text-rose-800">{customer.insight.title}</span>
                    <span className="text-xs text-rose-600 ml-auto">{customer.insight.churn_probability}% risk</span>
                  </div>
                  
                  {customer.insight.reasons?.length > 0 && (
                    <div className="text-xs text-slate-600">
                      <span className="font-medium">Why: </span>
                      {customer.insight.reasons.join(', ')}
                    </div>
                  )}

                  {customer.insight.impact && (
                    <div className="text-xs font-medium text-rose-700">
                      Impact: Potential revenue loss: ${customer.insight.impact.potential_revenue_loss}/mo
                    </div>
                  )}

                  {customer.insight.recommended_actions?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">What to do:</p>
                      {customer.insight.recommended_actions.slice(0, 3).map((action, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle className={`w-3 h-3 ${
                            action.priority === 'high' ? 'text-rose-500' : 'text-slate-400'
                          }`} />
                          <span className="text-slate-600">{action.action}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link to={`/customers/${customer.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    <Mail className="w-3 h-3" /> Generate Report
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}