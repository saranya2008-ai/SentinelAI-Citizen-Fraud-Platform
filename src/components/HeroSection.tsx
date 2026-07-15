import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-2xl shadow-blue-500/30">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          Sentinel<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-300 mb-6 tracking-wider">
          Detect. Verify. Protect.
        </p>

        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your intelligent shield against digital arrest scams, phishing attacks, fake government calls,
          and fraudulent payment requests. Stay protected with AI-powered threat detection.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: AlertTriangle, label: 'Digital Arrest Detection', color: 'from-red-500 to-orange-500' },
            { icon: Eye, label: 'Phishing Analysis', color: 'from-amber-500 to-yellow-500' },
            { icon: Lock, label: 'Fraud Prevention', color: 'from-green-500 to-emerald-500' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-5 py-2.5 hover:bg-slate-800/70 transition-all duration-300 group cursor-default"
            >
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color}`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-300 font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#analyzer"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <Shield className="w-5 h-5" />
            <span>Analyze Now</span>
          </a>
          <a
            href="#emergency"
            className="inline-flex items-center gap-2 bg-red-600/10 border-2 border-red-500/50 text-red-400 font-semibold px-8 py-4 rounded-xl hover:bg-red-600/20 hover:border-red-400 transition-all duration-300"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Help</span>
          </a>
        </div>

        {/* Stats preview */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { value: '10L+', label: 'Scams Detected' },
            { value: '50K+', label: 'Citizens Protected' },
            { value: '\u20B9487Cr', label: 'Money Saved' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-slate-400 text-sm">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
