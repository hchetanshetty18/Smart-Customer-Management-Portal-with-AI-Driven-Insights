import { motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScopeRequirements from './components/ScopeRequirements'
import Deliverables from './components/Deliverables'
import DashboardPreview from './components/DashboardPreview'
import Footer from './components/Footer'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
        }}
      />


      <Navbar />
      <main>
        <Hero />
        <ScopeRequirements />
        <DashboardPreview />
        <Deliverables />
      </main>
      <Footer />
    </div>
  )
}

export default App
