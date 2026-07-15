import { useState } from 'react';
import { AlertTriangle, PhoneOff, KeyRound, Landmark, ShieldAlert, ExternalLink, PhoneCall, X, AlertOctagon, Clock, Shield, Ban, Siren, Zap, Users } from 'lucide-react';

const emergencySteps = [
  {
    id: 1,
    title: 'End the Call Immediately',
    description: 'Do not engage further. Hang up without providing any information. Fraudsters use psychological tactics to keep you on the line.',
    icon: PhoneOff,
    color: 'from-red-600 to-red-400',
    urgency: 'CRITICAL',
    timeEstimate: '0 seconds',
  },
  {
    id: 2,
    title: 'Do Not Share OTP',
    description: 'Never share One-Time Passwords, ATM PINs, CVV numbers, or any banking credentials - even if they claim to be from your bank.',
    icon: KeyRound,
    color: 'from-orange-600 to-amber-400',
    urgency: 'CRITICAL',
    timeEstimate: 'Ongoing',
  },
  {
    id: 3,
    title: 'Contact Your Bank',
    description: 'Call your bank\'s official customer care immediately using the number from your passbook or card. Request to freeze accounts if compromised.',
    icon: Landmark,
    color: 'from-amber-500 to-yellow-400',
    urgency: 'IMMEDIATE',
    timeEstimate: 'Within 5 mins',
  },
  {
    id: 4,
    title: 'Block the Number',
    description: 'Block the scammer\'s number on your phone. Report it as spam through Truecaller or your phone\'s native spam reporting feature.',
    icon: Ban,
    color: 'from-yellow-500 to-green-400',
    urgency: 'IMPORTANT',
    timeEstimate: 'Within 10 mins',
  },
  {
    id: 5,
    title: 'Report to Cybercrime Portal',
    description: 'File a complaint at cybercrime.gov.in or call the national helpline 1930. Reporting within the "Golden Hour" maximizes recovery chances.',
    icon: ShieldAlert,
    color: 'from-blue-500 to-cyan-400',
    urgency: 'ESSENTIAL',
    timeEstimate: 'Within 1 hour',
  },
];

const emergencyContacts = [
  { name: 'National Cybercrime Helpline', number: '1930', description: '24/7 Fraud Support', primary: true },
  { name: 'Police Emergency', number: '100', description: 'Immediate Police Help', primary: false },
  { name: 'Women Helpline', number: '181', description: 'Women Safety', primary: false },
  { name: 'Banking Ombudsman', number: '14440', description: 'Bank Disputes', primary: false },
];

export default function EmergencyAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="emergency" className="py-24 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950/${isExpanded ? '40' : '20'} to-slate-950 transition-all duration-700`} />
        {isExpanded && (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, transparent 50%)`,
              }} />
            </div>
            {/* Animated warning lines */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  style={{
                    top: `${20 + i * 15}%`,
                    animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-6">
            <Siren className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-400 text-sm font-medium">24/7 Emergency Response</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Emergency Fraud Assistant
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            If you suspect you're being scammed right now, click the button below immediately for step-by-step guidance.
          </p>
        </div>

        {/* Panic Button - Centered and Prominent */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Outer pulse rings */}
            {!isExpanded && (
              <>
                <div className="absolute inset-0 -m-8 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 -m-4 rounded-full bg-red-500/30 animate-pulse" style={{ animationDuration: '1.5s' }} />
              </>
            )}

            {/* Main Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`group relative inline-flex flex-col items-center gap-4 ${
                isExpanded
                  ? 'bg-slate-800/80 border-4 border-red-500'
                  : 'bg-gradient-to-b from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700'
              } text-white font-bold px-12 sm:px-16 py-8 sm:py-10 rounded-3xl shadow-2xl ${
                isExpanded ? 'shadow-red-500/20' : 'shadow-red-900/50'
              } transition-all duration-500 transform hover:scale-105`}
            >
              {/* Button glow */}
              {!isExpanded && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent to-red-400/20" />
              )}

              {/* Icon */}
              <div className="relative z-10">
                {isExpanded ? (
                  <X className="w-12 h-12" />
                ) : (
                  <div className="relative">
                    <AlertTriangle className="w-14 h-14 animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                  </div>
                )}
              </div>

              {/* Text */}
              <span className="relative z-10 text-xl sm:text-2xl tracking-wide">
                {isExpanded ? 'Close Emergency Guide' : 'I Think I\'m Being Scammed'}
              </span>

              {/* Subtitle */}
              {!isExpanded && (
                <span className="relative z-10 text-sm text-red-200 font-normal">
                  Click for immediate help
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Emergency Steps - Expanded View */}
        {isExpanded && (
          <div className="animate-fadeIn">
            {/* Golden Hour Alert Banner */}
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-500/50 rounded-2xl p-6 mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-amber-300 font-bold text-xl mb-1">
                    Golden Hour Response
                  </div>
                  <div className="text-white text-lg">
                    The first 60 minutes are critical. Money can often be recovered if reported within the "Golden Hour".
                    <span className="text-amber-300 font-semibold ml-1">Act now!</span>
                  </div>
                </div>
                <div className="sm:ml-auto flex-shrink-0">
                  <a
                    href="tel:1930"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
                  >
                    <PhoneCall className="w-5 h-5" />
                    Call 1930 Now
                  </a>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid lg:grid-cols-5 gap-4 mb-10">
              {emergencySteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    activeStep === idx ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                >
                  <div className={`h-full bg-slate-800/80 backdrop-blur border-2 ${
                    activeStep === idx ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-slate-700/50 hover:border-slate-600'
                  } rounded-2xl p-5 transition-all duration-300`}>
                    {/* Step Number Badge */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg`}>
                      {step.id}
                    </div>

                    {/* Icon */}
                    <div className="flex items-start gap-3 mb-3">
                      <step.icon className={`w-6 h-6 ${
                        idx === 0 ? 'text-red-400' :
                        idx === 1 ? 'text-orange-400' :
                        idx === 2 ? 'text-amber-400' :
                        idx === 3 ? 'text-yellow-400' : 'text-blue-400'
                      } flex-shrink-0 mt-1`} />
                      <div>
                        <h4 className="text-white font-semibold text-sm leading-tight">{step.title}</h4>
                        <span className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded ${
                          step.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          step.urgency === 'IMMEDIATE' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {step.urgency}
                        </span>
                      </div>
                    </div>

                    {/* Description (expanded on active) */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      activeStep === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <p className="text-slate-400 text-sm leading-relaxed pt-2 border-t border-slate-700/30">
                        {step.description}
                      </p>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {step.timeEstimate}
                      </div>
                    </div>

                    {/* Click hint */}
                    <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Click for details
                    </div>
                  </div>

                  {/* Arrow connector (not on last item) */}
                  {idx < emergencySteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                        <Zap className="w-2 h-2 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* List View for Mobile */}
            <div className="lg:hidden space-y-3 mb-10">
              {emergencySteps.map((step, idx) => (
                <div
                  key={`mobile-${step.id}`}
                  className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-4 h-4 text-slate-400" />
                      <h4 className="text-white font-medium text-sm">{step.title}</h4>
                    </div>
                    <p className="text-slate-400 text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Contacts Grid */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8">
              <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-green-400" />
                Emergency Helpline Numbers
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {emergencyContacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.number}`}
                    className={`block p-4 rounded-xl transition-all text-center ${
                      contact.primary
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-2 border-green-500/50 hover:border-green-400'
                        : 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className={`text-3xl font-bold mb-1 ${
                      contact.primary ? 'text-green-400' : 'text-white'
                    }`}>
                      {contact.number}
                    </div>
                    <div className={`text-sm ${contact.primary ? 'text-green-300' : 'text-slate-400'}`}>
                      {contact.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{contact.description}</div>
                    {contact.primary && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-400">
                        <PhoneCall className="w-3 h-3" />
                        Available 24/7
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                <ExternalLink className="w-5 h-5" />
                Report at cybercrime.gov.in
              </a>
              <a
                href="tel:1930"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-500/20"
              >
                <PhoneCall className="w-5 h-5" />
                Call 1930 Helpline
              </a>
              <a
                href="https://www.sbin.co.in/portal/cms/general_information/Know_Cyber_Fraud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-medium px-6 py-3 rounded-xl transition-all"
              >
                <Landmark className="w-5 h-5" />
                Find Bank Customer Care
              </a>
              <a
                href="https://www.dialabank.com/block-debit-card-online/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500/50 text-red-400 font-medium px-6 py-3 rounded-xl transition-all"
              >
                <Shield className="w-5 h-5" />
                Block Debit/Credit Card
              </a>
            </div>
          </div>
        )}

        {/* Safety Tips Banner */}
        {!isExpanded && (
          <div className="mt-12 bg-slate-800/30 backdrop-blur border border-slate-700/30 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Remember These Key Rules</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <span>Never share OTP, PIN, or CVV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <span>Government doesn't call for payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <span>No arrest warrants over phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <span>End suspicious calls immediately</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
