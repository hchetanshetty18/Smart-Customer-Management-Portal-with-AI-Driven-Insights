import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle, Activity, Ticket, Loader2, CheckCircle, TrendingDown, TrendingUp, Mail, FileText, XCircle, Cpu } from 'lucide-react';

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

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [devices, setDevices] = useState([]);
  const [insight, setInsight] = useState(null);
  const [healthBreakdown, setHealthBreakdown] = useState(null);
  const [emailReport, setEmailReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [custRes, healthRes, breakdownRes, devRes] = await Promise.all([
          fetch(`${API_URL}/customers/${id}`),
          fetch(`${API_URL}/customers/${id}/health`),
          fetch(`${API_URL}/customers/${id}/health/breakdown`),
          fetch(`${API_URL}/customers/${id}/devices`)
        ]);
        
        const custData = await custRes.json();
        const healthData = await healthRes.json();
        const breakdown = await breakdownRes.json();
        const devData = await devRes.json();
        
        if (custData.success) setCustomer(custData.data);
        if (healthData.success) setInsight(healthData.data);
        if (breakdown.success) setHealthBreakdown(breakdown.data);
        if (devData.success) setDevices(devData.data);

        const [tRes, eRes] = await Promise.all([
          fetch(`${API_URL}/customers/${id}/tickets`),
          fetch(`${API_URL}/customers/${id}/events`)
        ]);
        const tData = await tRes.json();
        const eData = await eRes.json();
        
        if (tData.success) setTickets(tData.data);
        if (eData.success) setEvents(eData.data);
      } catch (err) {
        console.error('Failed to fetch customer:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const generateReport = async () => {
    try {
      const res = await fetch(`${API_URL}/email-summary/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) setEmailReport(data.data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Customer not found</p>
        <Link to="/customers" className="text-indigo-600 hover:underline mt-2 inline-block">Back to Customers</Link>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/customers" className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-slate-900">{customer.name}</h1>
          <p className="text-sm text-slate-500">{customer.region} • {customer.plan} • ID: {customer.id}</p>
        </div>
      </div>

      {emailReport && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Generated Report</h3>
            <button onClick={() => setEmailReport(null)}><XCircle className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="p-5 max-h-96 overflow-y-auto">
            <div className="text-xs text-slate-500 mb-2 font-semibold">{emailReport.subject}</div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">{emailReport.body}</pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {healthBreakdown && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-[16px] font-semibold text-slate-900">Health Score Breakdown</h3>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(healthBreakdown.breakdown).map(([key, metric]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capital text-slate-500">{key}</span>
                      <span className="font-medium text-slate-700">{Math.round(metric.contribution)} pts</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                         className={`h-2 rounded-full ${
                          metric.status === 'good' ? 'bg-emerald-500' : metric.status === 'fair' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${Math.min(100, metric.contribution)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="col-span-full border-t border-slate-100 pt-4 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">Total Score</span>
                    <span className="font-bold text-lg text-slate-900">{healthBreakdown.calculated_health_score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-[16px] font-semibold text-slate-900">Support Tickets</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {tickets.length > 0 ? tickets.slice(0, 5).map(t => (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      t.severity === 'Critical' ? 'bg-rose-100' : t.severity === 'High' ? 'bg-orange-100' : 'bg-slate-100'
                    }`}>
                      <Ticket className={`w-4 h-4 ${
                        t.severity === 'Critical' ? 'text-rose-600' : t.severity === 'High' ? 'text-orange-600' : 'text-slate-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.severity} • {t.status}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-slate-500 text-sm">No support tickets</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[16px] font-semibold text-slate-900">Device Inventory</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {devices.length > 0 ? devices.map(d => (
                <div key={d.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <Cpu className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{d.device_name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{d.serial_number}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 
                    d.status === 'Offline' ? 'bg-rose-100 text-rose-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status}
                  </span>
                </div>
              )) : (
                <div className="col-span-full p-4 text-slate-500 text-sm">No devices assigned</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[16px] font-semibold text-slate-900">Recent Events</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {events.length > 0 ? events.slice(0, 5).map(e => (
                <div key={e.id} className="p-4 flex items-center justify-between text-sm">
                  <span className="text-slate-700">{e.description || e.type}</span>
                  <span className="text-slate-500 text-xs">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </div>
              )) : (
                <div className="p-4 text-slate-500 text-sm">No recent events</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Status & Metrics</h3>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${getHealthColor(customer.health_score)}`}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Health Score</span>
                </div>
                <span className="font-bold">{customer.health_score}/100</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                customer.churn_risk === 'Healthy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                customer.churn_risk === 'Moderate' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Churn Risk</span>
                </div>
                <span className="font-bold">{customer.churn_risk}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm text-slate-600">Revenue</span>
                <span className="font-medium text-slate-900">${customer.revenue}/mo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm text-slate-600">NPS Score</span>
                <span className="font-medium text-slate-900">{customer.nps_score || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm text-slate-600">Open Tickets</span>
                <span className="font-medium text-slate-900">{customer.open_tickets || 0}</span>
              </div>
            </div>
          </div>

          {insight && insight.risk_level !== 'Healthy' && (
            <div className={`rounded-xl shadow-sm border p-5 ${
              insight.risk_level === 'High' 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className={`w-5 h-5 ${
                  insight.risk_level === 'High' ? 'text-rose-600' : 'text-amber-600'
                }`} />
                <h3 className="text-[16px] font-semibold text-slate-900">{insight.title}</h3>
              </div>
              
              <div className="text-sm mb-3">
                <span className="font-medium">Churn Probability: </span>
                <span className={`font-bold ${
                  insight.churn_probability >= 60 ? 'text-rose-600' : 'text-amber-600'
                }`}>{insight.churn_probability}%</span>
              </div>

              {insight.reasons?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Why at risk:</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {insight.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.recommended_actions?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1">What to do:</p>
                  <div className="space-y-1">
                    {insight.recommended_actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle className={`w-3 h-3 ${
                          action.priority === 'high' ? 'text-rose-500' : 'text-slate-400'
                        }`} />
                        <span className="text-slate-700">{action.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {insight.impact && (
                <div className="text-xs font-medium text-slate-700 mb-3">
                  Impact: Potential revenue loss: ${insight.impact.potential_revenue_loss}/mo
                </div>
              )}

              <button 
                onClick={generateReport}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 w-full justify-center"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Insight</h3>
            </div>
            <p className="text-sm text-indigo-900/80">
              {insight?.risk_level === 'Healthy' 
                ? 'This customer is healthy with good usage metrics and engagement.'
                : insight?.risk_level === 'Moderate'
                ? 'Monitor this customer closely. Some risk factors detected.'
                : 'This customer needs immediate attention. Multiple risk factors detected.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}