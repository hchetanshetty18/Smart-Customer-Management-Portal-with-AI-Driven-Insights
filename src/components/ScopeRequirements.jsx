import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  LayoutDashboard,
  MessageSquare,
  HeartPulse,
  TrendingDown,
  Mail,
  ChevronRight,
  Server,
  Globe,
  BarChart3,
  FileText,
  AlertTriangle,
  Clock,
} from 'lucide-react'

const tabs = [
  {
    id: 'data',
    label: 'Synthetic Data',
    icon: Database,
    color: 'from-indigo-500 to-indigo-400',
    accent: 'indigo',
    title: 'Synthetic Data Generation',
    subtitle: '200+ realistic customer records with rich attributes',
    details: [
      { icon: Server, text: 'Company name, industry vertical, and company size' },
      { icon: Globe, text: 'Region/geography distribution across NA, EMEA, APAC' },
      { icon: BarChart3, text: 'NPS scores (0–100), usage metrics, and engagement data' },
      { icon: FileText, text: 'Contract value, renewal dates, and support ticket history' },
      { icon: HeartPulse, text: 'Product adoption rates and feature utilization stats' },
      { icon: Clock, text: 'Historical interaction logs spanning 12+ months' },
    ],
    preview: {
      type: 'table',
      headers: ['Company', 'Region', 'NPS', 'Contract ($K)', 'Health'],
      rows: [
        ['Nexus Networks', 'NA', '82', '$245K', '● High'],
        ['CloudBridge Ltd', 'EMEA', '45', '$180K', '● Medium'],
        ['Pacific Routing', 'APAC', '28', '$92K', '● At Risk'],
        ['TerraSwitch Corp', 'NA', '91', '$310K', '● High'],
        ['Quantum Fiber AG', 'EMEA', '62', '$155K', '● Medium'],
      ],
    },
  },
  {
    id: 'portal',
    label: 'Web Portal',
    icon: LayoutDashboard,
    color: 'from-cyan-500 to-cyan-400',
    accent: 'cyan',
    title: 'Full-Featured Web Portal',
    subtitle: 'Complete CRUD views for customers, tickets, and inventory',
    details: [
      { icon: Database, text: 'Customer Management — Create, read, update, delete records' },
      { icon: FileText, text: 'Support Tickets — Track issues with priority and status' },
      { icon: Server, text: 'Hardware Inventory — Monitor networking equipment lifecycle' },
      { icon: BarChart3, text: 'Interactive Dashboards — Real-time KPI visualizations' },
      { icon: Globe, text: 'Role-Based Access — Admin, manager, and viewer permissions' },
      { icon: HeartPulse, text: 'Audit Logging — Full history of all data modifications' },
    ],
    preview: {
      type: 'crud',
    },
  },
  {
    id: 'nlquery',
    label: 'NL Query',
    icon: MessageSquare,
    color: 'from-violet-500 to-violet-400',
    accent: 'violet',
    title: 'Natural Language Query Interface',
    subtitle: 'LLM-powered search that understands plain English questions',
    details: [
      { icon: MessageSquare, text: 'Ask questions in plain English, get structured answers' },
      { icon: Database, text: 'Automatic SQL/filter generation from natural language' },
      { icon: BarChart3, text: 'Inline chart generation for data-oriented queries' },
      { icon: FileText, text: 'Query history and saved searches for repeated analysis' },
      { icon: Server, text: 'Context-aware suggestions as you type' },
      { icon: Globe, text: 'Multi-table joins handled transparently' },
    ],
    preview: {
      type: 'nlquery',
      queries: [
        'Show me all customers in APAC with NPS below 50',
        'Which accounts have the highest churn risk?',
        'Compare revenue by region for Q4',
        'List overdue support tickets for enterprise clients',
        'What is the average contract value by industry?',
      ],
    },
  },
  {
    id: 'health',
    label: 'Health Score',
    icon: HeartPulse,
    color: 'from-emerald-500 to-emerald-400',
    accent: 'emerald',
    title: 'AI-Powered Health Scoring',
    subtitle: 'Logistic Regression & Gradient Boosting models for account health',
    details: [
      { icon: HeartPulse, text: 'Multi-factor scoring using engagement, NPS, and usage data' },
      { icon: BarChart3, text: 'Logistic Regression baseline for interpretable predictions' },
      { icon: TrendingDown, text: 'Gradient Boosting (XGBoost) for higher accuracy ensemble' },
      { icon: FileText, text: 'Feature importance ranking for each health prediction' },
      { icon: AlertTriangle, text: 'Confidence intervals and model explanation outputs' },
      { icon: Clock, text: 'Weekly model retraining on latest customer behavior data' },
    ],
    preview: {
      type: 'health',
    },
  },
  {
    id: 'churn',
    label: 'Churn Risk',
    icon: TrendingDown,
    color: 'from-rose-500 to-rose-400',
    accent: 'rose',
    title: 'Churn Prediction Engine',
    subtitle: '90-day risk window with top contributing factors per account',
    details: [
      { icon: AlertTriangle, text: '90-day rolling window churn prediction per customer' },
      { icon: BarChart3, text: '"Top Contributing Factors" breakdown for each flagged account' },
      { icon: TrendingDown, text: 'Risk tiers: Critical (>80%), High (60-80%), Moderate (40-60%)' },
      { icon: Mail, text: 'Automated alerts when accounts cross risk thresholds' },
      { icon: FileText, text: 'Retention playbook suggestions based on churn drivers' },
      { icon: Clock, text: 'Historical accuracy tracking — precision/recall reporting' },
    ],
    preview: {
      type: 'churn',
    },
  },
  {
    id: 'email',
    label: 'Email Agent',
    icon: Mail,
    color: 'from-amber-500 to-amber-400',
    accent: 'amber',
    title: 'Email Summary Agent',
    subtitle: 'Weekly automated account reviews delivered to stakeholders',
    details: [
      { icon: Mail, text: 'Automated weekly email digests per account manager' },
      { icon: FileText, text: 'AI-generated executive summaries of account health changes' },
      { icon: AlertTriangle, text: 'Escalation highlights for accounts needing immediate attention' },
      { icon: BarChart3, text: 'Embedded mini-charts for quick visual understanding' },
      { icon: Clock, text: 'Configurable schedule — daily, weekly, or bi-weekly cadence' },
      { icon: Globe, text: 'Multi-recipient support with role-based content filtering' },
    ],
    preview: {
      type: 'email',
    },
  },
]

function DataTablePreview({ data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {data.headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${
                    j === 0
                      ? 'font-medium text-white'
                      : cell.includes('High')
                        ? 'text-emerald-400'
                        : cell.includes('At Risk')
                          ? 'text-rose-400'
                          : cell.includes('Medium')
                            ? 'text-amber-400'
                            : 'text-slate-300'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NLQueryPreview({ queries }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
        <MessageSquare className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="text-sm text-slate-400">Ask anything about your customers...</span>
      </div>
      <div className="space-y-2">
        {queries.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-violet-400/50 group-hover:text-violet-400 transition-colors shrink-0" />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
              "{q}"
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CRUDPreview() {
  const items = [
    { name: 'Customers', count: 247, status: 'Active' },
    { name: 'Support Tickets', count: 89, status: '12 Open' },
    { name: 'Inventory Items', count: 1340, status: 'Synced' },
  ]
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5"
        >
          <div>
            <div className="text-sm font-medium text-white">{item.name}</div>
            <div className="text-xs text-slate-500">{item.count} records</div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function HealthPreview() {
  const scores = [
    { label: 'Engagement', value: 85, color: 'bg-emerald-400' },
    { label: 'NPS Score', value: 72, color: 'bg-indigo-400' },
    { label: 'Usage Rate', value: 91, color: 'bg-cyan-400' },
    { label: 'Support Load', value: 34, color: 'bg-amber-400' },
  ]
  return (
    <div className="space-y-4">
      {scores.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-400">{s.label}</span>
            <span className="text-white font-semibold">{s.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.value}%` }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${s.color}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ChurnPreview() {
  const risks = [
    {
      company: 'CloudBridge Ltd',
      risk: 87,
      factors: ['Low NPS (45)', 'Declining usage', 'Open escalations'],
      tier: 'Critical',
    },
    {
      company: 'Pacific Routing',
      risk: 72,
      factors: ['Contract expiring', 'No recent engagement'],
      tier: 'High',
    },
    {
      company: 'DataWave Inc',
      risk: 45,
      factors: ['Below-avg adoption'],
      tier: 'Moderate',
    },
  ]
  return (
    <div className="space-y-3">
      {risks.map((r, i) => (
        <motion.div
          key={r.company}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">{r.company}</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                r.tier === 'Critical'
                  ? 'bg-rose-500/10 text-rose-400'
                  : r.tier === 'High'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-yellow-500/10 text-yellow-400'
              }`}
            >
              {r.risk}% — {r.tier}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {r.factors.map((f) => (
              <span
                key={f}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function EmailPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <Mail className="w-4 h-4 text-amber-400" />
        <div>
          <div className="text-sm font-medium text-white">Weekly Account Digest</div>
          <div className="text-xs text-slate-500">From: Kastomer AI Agent</div>
        </div>
      </div>
      <div className="px-4 py-3 text-sm space-y-3">
        <p className="text-slate-400">
          Hi Sarah, here's your weekly portfolio summary:
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
            <span className="text-slate-300 text-xs">
              <strong className="text-rose-400">Alert:</strong> CloudBridge Ltd churn risk increased to 87%
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span className="text-slate-300 text-xs">
              <strong className="text-emerald-400">Positive:</strong> Nexus Networks NPS improved +12 pts
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <span className="text-slate-300 text-xs">
              <strong className="text-amber-400">Action:</strong> 3 contracts up for renewal this month
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TabPreview({ tab }) {
  switch (tab.preview.type) {
    case 'table':
      return <DataTablePreview data={tab.preview} />
    case 'nlquery':
      return <NLQueryPreview queries={tab.preview.queries} />
    case 'crud':
      return <CRUDPreview />
    case 'health':
      return <HealthPreview />
    case 'churn':
      return <ChurnPreview />
    case 'email':
      return <EmailPreview />
    default:
      return null
  }
}

export default function ScopeRequirements() {
  const [activeTab, setActiveTab] = useState('data')
  const active = tabs.find((t) => t.id === activeTab)

  return (
    <section id="scope" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">
            Project Scope
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Scope & Requirements
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Six interconnected modules powering the next generation of customer
            intelligence for enterprise networking hardware.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'glass text-white shadow-lg glow-indigo'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-3xl p-6 sm:p-8 glow-indigo"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Details */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${active.color} bg-opacity-10 mb-4`}
                  style={{ background: 'rgba(99, 102, 241, 0.08)' }}
                >
                  <active.icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300">
                    Module
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {active.title}
                </h3>
                <p className="text-slate-400 mb-6">{active.subtitle}</p>

                <div className="space-y-3">
                  {active.details.map((d, i) => {
                    const DIcon = d.icon
                    return (
                      <motion.div
                        key={d.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] transition-colors">
                          <DIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-300 leading-relaxed">
                          {d.text}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Preview */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs text-slate-500 font-mono">
                    preview.kastomer.ai
                  </span>
                </div>
                <TabPreview tab={active} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
