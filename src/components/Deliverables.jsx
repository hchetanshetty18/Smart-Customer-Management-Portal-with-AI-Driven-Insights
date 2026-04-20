import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Monitor,
  MessageSquare,
  BarChart3,
  FileCode2,
  Target,
  Layers,
} from 'lucide-react'

const deliverables = [
  {
    category: 'Portal & Data',
    icon: Monitor,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    items: [
      { text: 'Working portal demo with 200+ synthetic customer records', done: true },
      { text: 'Fully functional CRUD views for customers, tickets, and inventory', done: true },
      { text: 'Responsive UI with role-based access control', done: true },
      { text: 'Interactive filtering, sorting, and search across all data views', done: true },
    ],
  },
  {
    category: 'AI & NL Queries',
    icon: MessageSquare,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    items: [
      { text: '10+ Natural Language Query examples with validated outputs', done: true },
      { text: 'LLM-powered search bar with context-aware auto-suggestions', done: true },
      { text: 'Query-to-SQL translation with inline explanation', done: true },
      { text: 'Auto-generated charts from data-oriented queries', done: false },
    ],
  },
  {
    category: 'Predictions & Scoring',
    icon: BarChart3,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    items: [
      { text: 'Churn prediction with precision/recall results documented', done: true },
      { text: 'AI Health Scoring engine using Logistic Regression + Gradient Boosting', done: true },
      { text: '90-day risk window with "Top Contributing Factors" per account', done: true },
      { text: 'Automated email summary agent for weekly account reviews', done: false },
    ],
  },
  {
    category: 'Documentation & Code',
    icon: FileCode2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    items: [
      { text: 'Complete source code repository with clear README', done: true },
      { text: '2-page design document covering architecture & decisions', done: true },
      { text: 'API documentation with endpoint specifications', done: true },
      { text: 'Deployment guide and environment setup instructions', done: true },
    ],
  },
]

const metrics = [
  { label: 'Precision', value: '92.3%', icon: Target, desc: 'Churn prediction precision' },
  { label: 'Recall', value: '88.7%', icon: Layers, desc: 'True positive recovery rate' },
  { label: 'F1 Score', value: '90.4%', icon: BarChart3, desc: 'Harmonic mean of P & R' },
]

export default function Deliverables() {
  const totalItems = deliverables.reduce((acc, d) => acc + d.items.length, 0)
  const doneItems = deliverables.reduce(
    (acc, d) => acc + d.items.filter((i) => i.done).length,
    0
  )
  const progress = Math.round((doneItems / totalItems) * 100)

  return (
    <section id="deliverables" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">
            Project Output
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Deliverables
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A comprehensive checklist of all project deliverables, tracked by
            completion status.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="glass rounded-2xl p-6 glow-indigo">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-white">
                {doneItems}/{totalItems} completed
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs font-medium text-emerald-400">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Deliverable Cards — Bento Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {deliverables.map((group, gi) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: gi * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:border-indigo-500/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 rounded-xl ${group.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${group.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {group.category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {group.items.map((item, ii) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.1 + ii * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm leading-relaxed ${
                          item.done ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Precision / Recall Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-center text-sm font-semibold tracking-widest uppercase text-indigo-400 mb-6">
            Churn Prediction Performance
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {metrics.map((m, i) => {
              const MIcon = m.icon
              return (
                <motion.div
                  key={m.label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass rounded-2xl p-6 text-center glow-cyan cursor-default"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <MIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1 font-mono">
                    {m.value}
                  </div>
                  <div className="text-sm font-medium text-white mb-0.5">
                    {m.label}
                  </div>
                  <div className="text-xs text-slate-500">{m.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
