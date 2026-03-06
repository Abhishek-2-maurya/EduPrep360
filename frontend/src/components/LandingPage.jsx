import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, BarChart3, ShieldCheck, Clock, MonitorPlay,
  ChevronRight, Code2, Lock, Sparkles, CheckCircle, AlertCircle
} from "lucide-react";


const smoothEase = [0.25, 0.4, 0.25, 1];


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const footerLinks = {
  Product: [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Integrations", path: "/integrations" },
    { name: "Updates", path: "/updates" }
  ],
  Resources: [
    { name: "Blog", path: "/blog" },
    { name: "Docs", path: "/docs" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Support", path: "/support" }
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" }
  ]
};

const MeshGradientBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-200/30 blur-[120px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/30 blur-[120px]"
    />
    <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-200/20 blur-[100px]" />
  </div>
);

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#a0a0e5] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">


      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-sm">
            <GraduationCap className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            EduPrep<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 font-extrabold">360</span>
            <Sparkles size={14} className="text-indigo-500 ml-1 mb-2" />
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link to="/register" className="group relative px-5 py-2.5 font-bold text-sm text-white rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]">
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-[200%_100%] animate-gradient-x"></div>
            <span className="relative flex items-center gap-2">Get Started <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></span>
          </Link>
        </div>
      </motion.header>


      <section className="relative pt-28 pb-20 px-6 md:px-12 overflow-hidden">
        <MeshGradientBackground />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8 relative z-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-sm font-bold shadow-xs backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              The Future of Digital Assessment
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-slate-900 leading-[1.05] tracking-tight">
              Master the art of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
                online examination.
              </span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
              The most secure, scalable, and insightful platform for modern institutions. Transform how you conduct assessments with AI-driven integrity and real-time analytics.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-[1.02] group">
                Start Free Trial
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="flex items-center justify-center bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-base font-bold hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 transition-all duration-300">
                Watch Video
                <MonitorPlay size={18} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Layered Product Mockup */}
          <div className="relative hidden lg:block perspective-1000">
            {/* Floating Orbital Elements */}
            <motion.div variants={floatingAnimation} animate="animate" className="absolute -top-12 -left-12 z-20 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 backdrop-blur-md">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold">Status</p><p className="text-sm font-bold text-slate-800">98.5% Pass Rate</p></div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -right-8 z-20 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><ShieldCheck size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold">Security</p><p className="text-sm font-bold text-slate-800">Browser Locked</p></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="relative bg-white/80 backdrop-blur-xl border-[3px] border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-4xl overflow-hidden flex flex-col transform-gpu"
            >
              <div className="h-11 bg-slate-50/80 border-b border-slate-100 flex items-center px-5 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                  <Lock size={10} />
                  secure.eduprep360.com/exam-session
                </div>
                <div className="w-8"></div>
              </div>

              <div className="p-8 bg-[#FAFAFA]/50 flex-1 relative">
                {/* Decorative blurred circles inside mockup */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl mix-blend-multiply"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl mix-blend-multiply"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Live Session</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Data Structures Final</h3>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3 text-sm font-bold text-indigo-700 shadow-sm">
                    <Clock size={18} className="text-indigo-400 animate-pulse" />
                    00:42:15
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm relative z-10">
                  <p className="text-sm font-semibold text-slate-400 mb-4">Question 4 of 50</p>
                  <p className="text-lg font-bold text-slate-800 mb-6">What is the time complexity of searching in a balanced Binary Search Tree (BST)?</p>

                  <div className="space-y-3">
                    {['O(n)', 'O(n log n)', 'O(log n)'].map((opt, i) => (
                      <div key={i} className={`p-4 rounded-xl border-2 text-sm font-bold flex items-center gap-4 transition-all cursor-pointer ${i === 2 ? 'border-indigo-500 bg-indigo-50/50 text-indigo-800 shadow-md shadow-indigo-100' : 'border-slate-200/60 bg-white text-slate-600 hover:border-slate-300'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 2 ? 'border-indigo-500' : 'border-slate-300'}`}>
                          {i === 2 && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>}
                        </div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="py-12 border-y border-slate-100 bg-white/60 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-500 mb-8">TRUSTED BY LEADING INSTITUTIONS</p>
          <div className="flex justify-center gap-12 md:gap-20 opacity-40 grayscale mix-blend-multiply flex-wrap">
            {/* Placeholders for logos. Replace with real SVGs. */}
            {['Stanford', 'MIT', 'Berkeley', 'Cambridge', 'Oxford'].map((name, i) => (
              <h2 key={i} className="text-2xl font-black tracking-tighter text-slate-800">{name}</h2>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Interactive Cards */}
      <section className="py-28 bg-[#F8F9FC] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp} className="mb-20 text-center"
          >
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Supercharge your assessments.</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">A complete ecosystem of tools tailored for high-stakes testing, daily quizzes, and everything in between.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Code2, title: "Diverse Question Types", desc: "From multiple choice to live coding environments and essay grading.", color: "blue" },
              { icon: ShieldCheck, title: "AI-Powered Proctoring", desc: "Advanced behavior analysis, tab-lock, and identity verification.", color: "indigo" },
              { icon: BarChart3, title: "Granular Analytics", desc: "Deep dive into cohort performance, item difficulty, and learning gaps.", color: "purple" },
              { icon: Users, title: "Role-Based Access", desc: "Secure hierarchies for HODs, teachers, TAs, and students.", color: "pink" },
              { icon: Clock, title: "Strict Timelines", desc: "Automated open/close windows with timezone awareness.", color: "rose" },
              { icon: AlertCircle, title: "Live Intervention", desc: "Monitor active sessions and pause, resume, or terminate tests instantly.", color: "amber" },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeUp} className="group relative p-1 rounded-3xl bg-linear-to-br from-slate-100 to-slate-50/50 hover:from-blue-500 hover:to-indigo-500 transition-all duration-500 shadow-sm hover:shadow-md">
                <div className="relative h-full bg-white p-8 rounded-[22px] transition-all group-hover:bg-white/95">
                  <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 border border-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <feature.icon className={`text-${feature.color}-600`} size={26} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Vibrant & Impactful */}
      <section className="py-24 px-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: smoothEase }}
          className="max-w-6xl mx-auto bg-linear-to-br from-indigo-900 via-blue-900 to-indigo-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40"
        >
          {/* Animated background glow inside CTA */}
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-150 h-150 bg-blue-500 rounded-full blur-[150px] mix-blend-screen" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">Ready to transform <br /> your testing process?</h2>
            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Join the forward-thinking institutions setting the new standard for digital assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-xl">
                Create Free Account <ChevronRight size={20} />
              </Link>
            </div>
            {/* <p className="text-blue-200/80 text-sm mt-8 font-semibold flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" /> No credit card required. 14-day free trial.
            </p> */}
          </div>
        </motion.div>
      </section>

      {/* Footer - Clean & Organized */}
      <footer className="bg-[#F8F9FC] border-t border-slate-200/80 pt-20 pb-10 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-sm">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">EduPrep360</span>
            </div>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm font-medium">
              The enterprise-standard infrastructure for secure and scalable online examinations.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links], i) => (
            <div key={i}>
              <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                {title}
              </h4>

              <ul className="space-y-4 text-sm font-medium text-slate-500">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <p>© {new Date().getFullYear()} EduPrep360 Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-slate-900 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};