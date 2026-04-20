import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Brain,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

const stats = [
  { value: '200+', label: 'Customer Records', icon: Users },
  { value: '95%', label: 'Prediction Accuracy', icon: Brain },
  { value: '< 2s', label: 'Query Response', icon: Zap },
  { value: '10+', label: 'NL Query Examples', icon: Sparkles },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-8 sm:px-12"
    >

      <div className="relative max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="flex flex-col items-center max-w-4xl w-full text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
              HACK2HIRE 1.0 — Project 09
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-10"
          >
            <span className="text-white">Smart Customer</span>
            <br />
            <span className="text-white">Management Portal with</span>
            <br />
            <span className="gradient-text glow-text">AI-Driven Insights</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            A next-generation CRM platform purpose-built for a fictional networking
            hardware company. Combines intelligent health scoring, churn prediction,
            and natural language querying to transform raw customer data into
            actionable business intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="#dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-cyan-500 transition-all duration-500"
            >
              <BarChart3 className="w-5 h-5" />
              Explore Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#scope"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl glass text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <Shield className="w-5 h-5 text-indigo-400" />
              View Full Scope
            </a>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="glass rounded-2xl p-6 text-center group cursor-default glow-indigo"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-slate-500"
          >
            <span className="text-xs font-medium tracking-wider uppercase">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
