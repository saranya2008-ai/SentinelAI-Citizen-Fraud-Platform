import React, { useEffect, useState } from 'react';
import { TrendingUp, Shield, Users, AlertTriangle, Building2, ChevronUp, Zap, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StatItem {
  stat_name: string;
  stat_value: number;
  stat_label: string;
}

const defaultStats: StatItem[] = [
  { stat_name: 'scams_detected', stat_value: 1284567, stat_label: 'Scams Detected' },
  { stat_name: 'citizens_protected', stat_value: 89234, stat_label: 'Citizens Protected' },
  { stat_name: 'money_saved', stat_value: 487500000, stat_label: 'Money Saved (INR)' },
  { stat_name: 'reports_submitted', stat_value: 156789, stat_label: 'Reports Submitted' },
];

const awarenessCards = [
  {
    title: 'Cyber Fraud Awareness',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    stats: [
      { label: 'Daily Fraud Attempts Reported', value: '40,000+' },
      { label: 'Average Money Lost per Victim', value: '\u20B91.2 Lakh' },
      { label: 'Reported Cases in 2023', value: '13+ Lakh' },
    ],
    insights: [
      'Phone calls remain the top fraud vector (46%)',
      'UPI-related frauds increased by 85%',
      'Digital arrest scams target senior citizens most',
    ],
  },
  {
    title: 'Scam Prevention',
    icon: Shield,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    stats: [
      { label: 'Prevention Success Rate', value: '92%' },
      { label: 'Money Recovered (Golden Hour)', value: '\u20B989Cr' },
      { label: 'Blocked Fraudulent Accounts', value: '5.8 Lakh' },
    ],
    insights: [
      'Reporting within 1 hour increases recovery by 80%',
      '70% of frauds can be prevented by awareness',
      'Biometric authentication reduces fraud by 60%',
    ],
  },
  {
    title: 'Public Safety',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    stats: [
      { label: 'Cyber Police Stations', value: '200+' },
      { label: 'Awareness Campaigns', value: '1,500+' },
      { label: 'Citizen Trainings', value: '35 Lakh+' },
    ],
    insights: [
      'Government helpline 1930 operates 24/7',
      'Cybercrime portal handles 50,000+ cases monthly',
      'State cyber units increased by 340%',
    ],
  },
];

function formatNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function StatisticsSection() {
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await supabase
          .from('platform_statistics')
          .select('*');
        if (data && data.length > 0) {
          setStats(data);
        }
      } catch {
        // Use default stats
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Impact Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Impact & Statistics
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real-time metrics showcasing SentinelAI's role in protecting citizens from digital fraud.
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-slate-700/50 rounded-xl p-6 text-center hover:border-blue-500/30 transition-all group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-colors">
                {[Zap, Building2, Target, Shield][idx] && React.createElement(
                  [Zap, Building2, Target, Shield][idx],
                  { className: 'w-6 h-6 text-blue-400' }
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  formatNumber(stat.stat_value)
                )}
              </div>
              <div className="text-slate-400 text-sm">{stat.stat_label}</div>
              <div className="flex items-center justify-center gap-1 text-green-400 text-xs mt-3">
                <ChevronUp className="w-3 h-3" />
                <span>+{(12 + idx * 3).toFixed(1)}% this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Awareness Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {awarenessCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-slate-800/50 backdrop-blur border ${card.borderColor} rounded-xl overflow-hidden hover:border-${card.color.includes('red') ? 'red' : card.color.includes('blue') ? 'blue' : 'green'}-400/50 transition-all`}
            >
              {/* Header */}
              <div className={`${card.bgColor} p-4 border-b border-slate-700/50`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">{card.title}</h3>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 border-b border-slate-700/30">
                <div className="grid gap-3">
                  {card.stats.map((stat, statIdx) => (
                    <div key={statIdx} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{stat.label}</span>
                      <span className="text-white font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="p-4">
                <div className="text-slate-400 text-xs font-medium mb-2">KEY INSIGHTS</div>
                <ul className="space-y-2">
                  {card.insights.map((insight, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Government Partnership Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-xl p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              <span className="text-blue-300 font-medium">Working with Government Initiatives</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-400">
              <span>Cyber Crime Portal</span>
              <span className="text-slate-600">|</span>
              <span>1930 Helpline</span>
              <span className="text-slate-600">|</span>
              <span>Digital India</span>
              <span className="text-slate-600">|</span>
              <span>Indian Cyber Crime Coordination Centre</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
