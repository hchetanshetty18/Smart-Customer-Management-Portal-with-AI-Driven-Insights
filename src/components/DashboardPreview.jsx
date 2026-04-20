import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  HeartPulse,
  Activity,
  X,
} from 'lucide-react'

// Chart data
const revenueData = [
  { month: 'Jan', value: 350000 },
  { month: 'Feb', value: 400000 },
  { month: 'Mar', value: 425000 },
  { month: 'Apr', value: 385000 },
  { month: 'May', value: 480000 },
  { month: 'Jun', value: 515000 },
  { month: 'Jul', value: 490000 },
  { month: 'Aug', value: 565000 },
  { month: 'Sep', value: 600000 },
  { month: 'Oct', value: 575000 },
  { month: 'Nov', value: 650000 },
  { month: 'Dec', value: 700000 },
]

const churnTrendData = [
  { month: 'Jul', rate: 12 },
  { month: 'Aug', rate: 14 },
  { month: 'Sep', rate: 11 },
  { month: 'Oct', rate: 15 },
  { month: 'Nov', rate: 9 },
  { month: 'Dec', rate: 7 },
]

const healthDistribution = [
  { name: 'Healthy', value: 142, color: '#34d399' },
  { name: 'Moderate', value: 68, color: '#fbbf24' },
  { name: 'At Risk', value: 37, color: '#fb7185' },
]

const kpis = [
  {
    label: 'Total Customers',
    value: '247',
    change: '+12.3%',
    up: true,
    icon: Users,
    color: 'from-indigo-500/20 to-indigo-500/5',
    iconColor: 'text-indigo-400',
  },
  {
    label: 'Avg Health Score',
    value: '78.4',
    change: '+3.2',
    up: true,
    icon: HeartPulse,
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
  {
    label: 'Revenue (ARR)',
    value: '₹34.8Cr',
    change: '+18.7%',
    up: true,
    icon: DollarSign,
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
  },
  {
    label: 'Churn Rate',
    value: '7.2%',
    change: '-2.1%',
    up: false,
    icon: Activity,
    color: 'from-rose-500/20 to-rose-500/5',
    iconColor: 'text-rose-400',
  },
]

const churnAlerts = [
  {
    company: 'Zenith Infotech',
    risk: 87,
    region: 'Mumbai',
    factors: ['NPS dropped 18 pts', 'Usage down 42%', '3 escalated tickets'],
    revenue: '₹1.5Cr',
  },
  {
    company: 'Pinnacle Solutions',
    risk: 72,
    region: 'Bengaluru',
    factors: ['Contract expires in 22d', 'No login in 14d'],
    revenue: '₹76L',
  },
  {
    company: 'VistaTech Systems',
    risk: 64,
    region: 'Hyderabad',
    factors: ['Below-avg feature adoption', 'Competitor evaluation'],
    revenue: '₹1.74Cr',
  },
]

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            ₹{(p.value / 100000).toFixed(1)}L
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPreview() {
  const [alertDismissed, setAlertDismissed] = useState(false)

  return (
    <section id="dashboard" className="relative py-24 px-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-4">
            Interactive Preview
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Dashboard Experience
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A glimpse into the AI-powered analytics dashboard. Real-time insights,
            churn risk notifications, and health scoring — all in one view.
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-2 glow-indigo"
        >
          {/* Window Chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-rose-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <div className="ml-4 flex-1 max-w-md">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
                <span className="text-xs text-slate-500 font-mono">
                  dashboard.kastomer.ai/overview
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Churn Alert Banner */}
            {!alertDismissed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 w-full"
                style={{ marginBottom: '40px' }}
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-rose-300">
                    Churn Risk Alert:
                  </span>{' '}
                  <span className="text-sm text-slate-400">
                    3 accounts flagged as high risk in the next 90 days. Total ARR
                    at risk: <strong className="text-rose-300">₹4.0Cr</strong>
                  </span>
                </div>
                <button
                  onClick={() => setAlertDismissed(true)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </motion.div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon
                return (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}
                      >
                        <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${
                          kpi.up ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {kpi.up ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {kpi.change}
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{kpi.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-4 mb-6 w-full">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/5 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Revenue Trend
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <span className="text-slate-400">FY 2025-26</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#818cf8"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#818cf8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#818cf8"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Health Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
              >
                <h3 className="text-sm font-semibold text-white mb-1">
                  Health Distribution
                </h3>
                <p className="text-xs text-slate-500 mb-4">247 total accounts</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={healthDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {healthDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {healthDistribution.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-white font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Churn Trend + Alerts */}
            <div className="grid lg:grid-cols-2 gap-4 w-full">
              {/* Churn Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Churn Rate Trend
                    </h3>
                    <p className="text-xs text-slate-500">Last 6 months</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Improving
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <ReBarChart data={churnTrendData}>

                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Bar
                      dataKey="rate"
                      radius={[6, 6, 0, 0]}
                      fill="#818cf8"
                      maxBarSize={36}
                    />
                  </ReBarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Churn Risk Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Churn Risk Alerts
                    </h3>
                    <p className="text-xs text-slate-500">90-day prediction window</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-xs text-rose-400 font-medium">
                      3 alerts
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {churnAlerts.map((alert, i) => (
                    <motion.div
                      key={alert.company}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {alert.company}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500">
                            {alert.region}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {alert.revenue}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              alert.risk > 80
                                ? 'bg-rose-500/15 text-rose-400'
                                : alert.risk > 60
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            {alert.risk}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {alert.factors.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
