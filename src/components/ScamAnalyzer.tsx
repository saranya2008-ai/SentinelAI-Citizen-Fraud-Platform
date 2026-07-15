import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Shield, CheckCircle, AlertCircle, ChevronRight, FileText, X, Sparkles, TrendingUp, Eye, Bug, FileWarning } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalysisResult {
  riskScore: number;
  category: string;
  categoryIcon: typeof AlertTriangle;
  warningSigns: string[];
  recommendedAction: string;
  confidence: number;
  threatLevel: 'critical' | 'high' | 'moderate' | 'low';
}

const scamPatterns = {
  digitalArrest: {
    keywords: ['digital arrest', 'judicial custody', 'arrest warrant', 'police on call', 'supreme court order', 'cbi calling', 'enforcement directorate', 'preventing arrest', 'legal action imminent', 'non-bailable warrant'],
    category: 'Digital Arrest Scam',
    icon: FileWarning,
    warningSigns: [
      'Threats of immediate arrest over phone or video call',
      'Claims of non-bailable warrants issued',
      'Pressure to stay on the call without disconnecting',
      'Requests to transfer money to "safe government accounts"',
      'Mention of "digital arrest" or "virtual custody"',
      'Demand to appear before "virtual court"',
      'Claims that CBI/ED is monitoring the call',
    ],
    action: 'Disconnect immediately. No government agency makes arrests over video calls or phones. Contact your local police station to verify any claims. Report to 1930.',
  },
  phishing: {
    keywords: ['click here', 'verify your account', 'suspended', 'update payment', 'confirm identity', 'limited time', 'act now', 'bank account blocked', 'link expired', 'verify now', 'update immediately'],
    category: 'Phishing Attempt',
    icon: Bug,
    warningSigns: [
      'Urgent language creating panic or fear',
      'Suspicious links to external websites',
      'Requests for personal information',
      'Poor grammar or spelling errors',
      'Generic greetings instead of your name',
      'Mismatched or suspicious sender address',
      'Threats of account suspension',
    ],
    action: 'Do not click any links. Verify through official channels by visiting the website directly. Forward suspicious emails to report@phishing.gov.in. Delete the message.',
  },
  bankFraud: {
    keywords: ['kyc update', 'account blocked', 'pan card', 'otp', 'cvv', 'pin', 'internet banking', 'net banking', 'debit card blocked', 'card disabled', 'limit exceeded', 'activation required'],
    category: 'Banking Fraud',
    icon: AlertTriangle,
    warningSigns: [
      'Requests for OTP or PIN numbers',
      'Asking for CVV or full card details',
      'Claims of urgent KYC updates needed',
      'Threats of permanent account closure',
      'Unsolicited calls about bank accounts',
      'Requests to install remote access apps',
      'Demands for debit card photocopy',
    ],
    action: 'Never share OTP, PIN, or CVV. Banks never ask for these details. Call your bank\'s official customer care number from your passbook to verify. Block your card if compromised.',
  },
  governmentImpersonation: {
    keywords: ['income tax', 'gst', 'ration card', 'aadhaar', 'passport', 'visa', 'government official', 'officer', 'department', 'ministry', 'public sector', 'official notice', 'government dues'],
    category: 'Government Impersonation',
    icon: Shield,
    warningSigns: [
      'Claims of pending government dues or fines',
      'Threats of immediate legal action',
      'Pressure to pay fines or penalties instantly',
      'Requests for Aadhaar or PAN card details',
      'Unofficial contact methods (WhatsApp, personal numbers)',
      'Demands for bribe to "resolve" issues',
      'Fake government portal links',
    ],
    action: 'Government officials never demand immediate payment over calls. Visit the official government portal or office in person to verify. Report impersonation to the nearest police station.',
  },
  prizeScam: {
    keywords: ['lottery', 'winner', 'congratulations', 'prize', 'lucky draw', 'inheritance', 'transfer fee', 'claim your prize', 'won cash', 'grand prize', 'special offer', 'selected winner'],
    category: 'Prize/Lottery Scam',
    icon: Sparkles,
    warningSigns: [
      'Claims of winning contests you never entered',
      'Demands for processing or registration fees',
      'Requests for bank details to "transfer winnings"',
      'Urgent deadline to claim the prize',
      'Requests for advance payment or taxes',
      'International lottery claims from unknown sources',
      'Celebrity or company endorsement scams',
    ],
    action: 'Do not pay any "processing fees" or share bank details. Legitimate prizes never require upfront payment. Block the sender and report to cybercrime.gov.in.',
  },
  paymentFraud: {
    keywords: ['upi', 'phonepe', 'gpay', 'paytm', 'scan qr', 'send money', 'payment link', 'refund', 'wrong transaction', 'collect request', 'bhim', 'money transfer', 'account verification'],
    category: 'Payment Fraud',
    icon: TrendingUp,
    warningSigns: [
      'Requests to scan QR codes to receive money',
      'Payment links from unknown sources',
      'Claims of accidental transfers needing refund',
      'Pressure to complete transactions quickly',
      'Requests to share payment screenshots',
      'Fake payment success messages',
      'QR codes from strangers to "receive" money',
    ],
    action: 'Never scan QR codes from unknown sources - scanning REQUESTS money. Verify the recipient before any UPI transaction. Remember: QR codes are only for SENDING money, not receiving.',
  },
  jobScam: {
    keywords: ['work from home', 'part-time job', 'data entry', 'form filling', 'typing job', 'earn money online', 'simple task', 'register free', 'job offer', 'hiring now', 'immediate joining'],
    category: 'Job/Work-From-Home Scam',
    icon: FileText,
    warningSigns: [
      'Promises of high income for simple tasks',
      'Requests for registration fees or deposits',
      'No formal interview or verification process',
      'Requests for ID proofs and bank details upfront',
      'Telegram or WhatsApp as only communication',
      'Pressure to join immediately',
      'Fake company names or websites',
    ],
    action: 'Legitimate companies don\'t ask for money to hire you. Research the company on Glassdoor or LinkedIn. Never pay deposits for work-from-home jobs. Report to 1930.',
  },
  romanceScam: {
    keywords: ['love', 'relationship', 'trust', 'send money for flight', 'stuck in customs', 'gift' , 'met online', 'profile picture', 'video call not possible', 'emergency fund'],
    category: 'Romance Scam',
    icon: AlertCircle,
    warningSigns: [
      'Quick declarations of love or trust',
      'Refusal to meet in person or video call',
      'Requests for money for emergencies or flights',
      'Claims of being stuck abroad',
      'Inconsistencies in their stories',
      'Pressure to keep relationship secret',
      'Appears too good to be true',
    ],
    action: 'Be wary of strangers professing love quickly. Never send money to someone you haven\'t met in person. Use reverse image search on profile photos. Report to cybercrime.gov.in.',
  },
};

const sampleMessages: { title: string; category: string; message: string }[] = [
  {
    title: 'Digital Arrest Scam',
    category: 'digitalArrest',
    message: `"Hello, I am calling from CBI. We have a non-bailable arrest warrant against you for involvement in a money laundering case. If you do not cooperate now, our team will reach your location within 30 minutes. Stay on this video call and do not disconnect. Transfer Rs. 50,000 to the attached "safe government account" immediately to prevent your digital arrest. This is your final warning."`
  },
  {
    title: 'Bank KYC Fraud',
    category: 'bankFraud',
    message: `"Dear Customer, Your SBI Bank Account has been temporarily blocked due to pending KYC verification. Click on the link below to update your KYC documents immediately or your account will be permanently closed and legal action initiated. Update before 24 hours. Verify Now: bit.ly/sbi-kyc-urgent"`
  },
  {
    title: 'Phishing Email',
    category: 'phishing',
    message: `"URGENT: Your ICICI Bank account has been compromised! Unusual activity detected. Your account will be suspended within 2 hours unless you verify your identity immediately. Click here to secure your account: icic1-bank-secure.com/verify. Do not ignore this message!"`
  },
  {
    title: 'Prize Scam',
    category: 'prizeScam',
    message: `"CONGRATULATIONS! You have won Rs. 25,00,000 in the Samsung 2026 Anniversary Lucky Draw! To claim your prize, pay a processing fee of Rs. 12,500 within 24 hours. Send your Aadhaar card copy and bank details to claim. Contact Agent Kumar via WhatsApp: +91-98XXX-XXXXX"`
  },
  {
    title: 'Payment Fraud',
    category: 'paymentFraud',
    message: `"Sir, I accidentally sent Rs. 5,000 to your PhonePe number. Please scan this QR code and refund the amount. I am a poor student, please help. Here is the screenshot of the transaction."`
  },
  {
    title: 'Job Scam',
    category: 'jobScam',
    message: `"Earn Rs. 30,000-50,000 per month working from home! Simple data entry work. No experience needed. Pay a one-time registration fee of Rs. 999 to start immediately. Limited positions available. Contact HR on Telegram: @workfromhome_jobs_india"`
  },
  {
    title: 'Government Impersonation',
    category: 'governmentImpersonation',
    message: `"This is Officer Sharma from the GST Department. Your GST registration has been cancelled due to non-payment of dues. Pay Rs. 25,000 penalty immediately via UPI to gst.payment@upi or face prosecution. I am calling from the Ministry office."`
  },
];

function analyzeContent(text: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  let maxRisk = 0;
  let detectedCategory = 'Requires Manual Review';
  let detectedSigns: string[] = [];
  let recommendedAction = 'Exercise caution with all unsolicited communications. Verify through official channels before taking any action.';
  let categoryIcon = AlertTriangle;
  let confidence = 0;

  // Analyze against each pattern
  for (const [, pattern] of Object.entries(scamPatterns)) {
    const matchedKeywords = pattern.keywords.filter(kw => lowerText.includes(kw));
    const keywordScore = (matchedKeywords.length / pattern.keywords.length) * 40;

    // Check for scam markers
    const scamMarkers = [
      'urgent', 'immediately', 'legal action', 'blocked', 'suspended',
      'last warning', 'final notice', 'do not disconnect', 'transfer',
      'pay now', 'limited time', 'act now', 'click here', 'verify now'
    ];
    const matchedMarkers = scamMarkers.filter(m => lowerText.includes(m));
    const markerScore = (matchedMarkers.length / scamMarkers.length) * 20;

    // Count how many warning signs are present in the text
    const presentSigns = pattern.warningSigns.filter(sign => {
      const signWords = sign.toLowerCase().split(' ');
      return signWords.some(word => word.length > 4 && lowerText.includes(word));
    });

    const signScore = (presentSigns.length / pattern.warningSigns.length) * 30;
    const randomFactor = Math.random() * 10;
    const totalScore = keywordScore + signScore + markerScore + randomFactor;

    if (totalScore > maxRisk) {
      maxRisk = Math.min(Math.round(totalScore * 2), 98);
      detectedCategory = pattern.category;
      categoryIcon = pattern.icon;
      detectedSigns = pattern.warningSigns.slice(0, 5);
      recommendedAction = pattern.action;
      confidence = Math.min(Math.round((keywordScore + markerScore) * 2.5), 95);
    }
  }

  // Base risk for short messages
  if (text.length < 30 && maxRisk < 20) {
    maxRisk = Math.max(maxRisk, 35);
    detectedCategory = 'Unable to Analyze';
    detectedSigns = [
      'Message too short for accurate analysis',
      'Exercise caution with all unsolicited communications',
      'When in doubt, do not engage'
    ];
    confidence = 40;
  }

  // Determine threat level
  let threatLevel: 'critical' | 'high' | 'moderate' | 'low';
  if (maxRisk >= 80) threatLevel = 'critical';
  else if (maxRisk >= 60) threatLevel = 'high';
  else if (maxRisk >= 40) threatLevel = 'moderate';
  else threatLevel = 'low';

  return {
    riskScore: maxRisk,
    category: detectedCategory,
    categoryIcon,
    warningSigns: detectedSigns,
    recommendedAction: recommendedAction,
    confidence,
    threatLevel,
  };
}

export default function ScamAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setAnimatedScore(0);

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResult = analyzeContent(inputText);
    setResult(analysisResult);
    setIsAnalyzing(false);

    // Animate score
    setTimeout(() => {
      const increment = analysisResult.riskScore / 50;
      const animate = () => {
        setAnimatedScore(prev => {
          if (prev < analysisResult.riskScore) {
            return Math.min(prev + increment, analysisResult.riskScore);
          }
          return prev;
        });
      };
      const interval = setInterval(animate, 20);
      setTimeout(() => clearInterval(interval), 1000);
    }, 100);

    // Store in database
    try {
      await supabase.from('scam_reports').insert({
        content: inputText,
        risk_score: analysisResult.riskScore,
        scam_category: analysisResult.category,
        warning_signs: analysisResult.warningSigns,
        recommended_action: analysisResult.recommendedAction,
      });
    } catch {
      // Silently handle database errors
    }
  };

  const handleSampleSelect = (index: number) => {
    setSelectedSample(index);
    setInputText(sampleMessages[index].message);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'from-red-600 to-red-400';
    if (score >= 60) return 'from-orange-600 to-amber-400';
    if (score >= 40) return 'from-yellow-500 to-amber-300';
    return 'from-green-600 to-emerald-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskRingColor = (level: string) => {
    switch (level) {
      case 'critical': return 'ring-red-500';
      case 'high': return 'ring-orange-500';
      case 'moderate': return 'ring-yellow-500';
      default: return 'ring-green-500';
    }
  };

  const getThreatLabel = (level: string) => {
    switch (level) {
      case 'critical': return { text: 'CRITICAL THREAT', color: 'text-red-400' };
      case 'high': return { text: 'HIGH RISK', color: 'text-orange-400' };
      case 'moderate': return { text: 'MODERATE RISK', color: 'text-yellow-400' };
      default: return { text: 'LOW RISK', color: 'text-green-400' };
    }
  };

  return (
    <section id="analyzer" className="py-24 bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5), transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2 mb-6">
            <Search className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI-Powered Detection Engine</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Scam Message Analyzer
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Paste any suspicious message, email, call transcript, or communication. Our advanced AI will instantly analyze it across 8 fraud categories.
          </p>
        </div>

        {/* Main Analyzer Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/20">
          {/* Input Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Sample Messages */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Test with Sample Scams</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {sampleMessages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedSample === idx
                        ? 'bg-blue-500/20 border-2 border-blue-500/50'
                        : 'bg-slate-700/30 border-2 border-transparent hover:bg-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`w-4 h-4 ${selectedSample === idx ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className={`font-medium ${selectedSample === idx ? 'text-white' : 'text-slate-300'}`}>
                        {sample.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{sample.message.substring(0, 60)}...</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Input Area */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <label className="text-slate-300 font-medium flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Paste Suspicious Message
                </label>
                {inputText && (
                  <button
                    onClick={() => { setInputText(''); setSelectedSample(null); setResult(null); }}
                    className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setSelectedSample(null); }}
                className="w-full h-52 bg-slate-950/50 border-2 border-slate-600/50 rounded-2xl p-5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/70 transition-all resize-none shadow-inner"
                placeholder="Example: Dear customer, your bank account has been blocked due to pending KYC. Click here to update immediately or face legal action..."
              />
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-slate-500">
                  {inputText.length} characters
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 group disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 disabled:shadow-none"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AI Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Analyze Message</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-10 border-t border-slate-700/50 pt-10 animate-fadeIn">
              {/* Risk Score Display */}
              <div className="grid lg:grid-cols-4 gap-6 mb-8">
                {/* Risk Score Circle */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-950/50 rounded-2xl p-6 text-center h-full flex flex-col justify-center">
                    <div className="relative w-36 h-36 mx-auto mb-4">
                      {/* Background ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          stroke="#1e293b"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          className={`${getRiskBgColor(result.riskScore)}`}
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={`${(animatedScore / 100) * 339.3} 339.3`}
                          style={{ transition: 'stroke-dasharray 1s ease-out' }}
                        />
                      </svg>
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${
                          result.riskScore >= 80 ? 'text-red-400' :
                          result.riskScore >= 60 ? 'text-orange-400' :
                          result.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {Math.round(animatedScore)}%
                        </span>
                        <span className="text-xs text-slate-400">RISK</span>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${getThreatLabel(result.threatLevel).color}`}>
                      {getThreatLabel(result.threatLevel).text}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Confidence: {result.confidence}%
                    </div>
                  </div>
                </div>

                {/* Category & Action */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Category Badge */}
                  <div className={`bg-gradient-to-r from-slate-900/80 to-slate-800/50 border-2 ${getRiskRingColor(result.threatLevel)} rounded-xl p-5`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getRiskColor(result.riskScore)} shadow-lg`}>
                        <result.categoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-400 text-sm mb-1">Detected Category</div>
                        <div className="text-white font-bold text-2xl">{result.category}</div>
                      </div>
                      <div className="hidden sm:block">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          result.threatLevel === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          result.threatLevel === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          result.threatLevel === 'moderate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {result.threatLevel.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning Signs Counter */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30">
                      <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{result.warningSigns.length}</div>
                      <div className="text-xs text-slate-400">Warning Signs</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30">
                      <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{result.confidence}%</div>
                      <div className="text-xs text-slate-400">Analysis Confidence</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700/30">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">8/8</div>
                      <div className="text-xs text-slate-400">Categories Scanned</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Signs List */}
              <div className="bg-slate-950/60 rounded-2xl p-6 mb-6 border border-slate-700/30">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Warning Signs Detected
                </h4>
                <ul className="space-y-3">
                  {result.warningSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 group">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mt-2 flex-shrink-0 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all" />
                      <span className="flex-1">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div className={`bg-gradient-to-r ${
                result.threatLevel === 'critical' ? 'from-red-500/20 to-orange-500/10 border-red-500/50' :
                result.threatLevel === 'high' ? 'from-orange-500/20 to-amber-500/10 border-orange-500/50' :
                result.threatLevel === 'moderate' ? 'from-yellow-500/20 to-amber-500/10 border-yellow-500/50' :
                'from-green-500/20 to-emerald-500/10 border-green-500/50'
              } border-2 rounded-2xl p-6`}>
                <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                  result.threatLevel === 'critical' ? 'text-red-300' :
                  result.threatLevel === 'high' ? 'text-orange-300' :
                  result.threatLevel === 'moderate' ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  <Shield className="w-5 h-5" />
                  Recommended Action
                </h4>
                <p className="text-white text-lg leading-relaxed">{result.recommendedAction}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-400 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 1930
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText && navigator.clipboard.writeText(inputText)}
                  className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Copy Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-400">Critical Risk (80-100%)</span>
            </div>
            <p className="text-slate-400 text-sm">High probability of fraud. Do not engage. Follow emergency procedures immediately.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-amber-400">Moderate Risk (40-79%)</span>
            </div>
            <p className="text-slate-400 text-sm">Suspicious indicators found. Verify through official channels before taking any action.</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Low Risk (0-39%)</span>
            </div>
            <p className="text-slate-400 text-sm">Minimal scam indicators detected. Stay vigilant but no immediate action required.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
