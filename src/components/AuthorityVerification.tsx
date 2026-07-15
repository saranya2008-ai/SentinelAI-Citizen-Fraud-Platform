import { useState, useRef, useEffect } from 'react';
import { BadgeCheck, User, Send, AlertTriangle, Shield, CheckCircle, XCircle, HelpCircle, Bot, ChevronDown, ExternalLink, Phone, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  details?: VerificationDetails;
}

interface VerificationDetails {
  isLegitimate: boolean;
  warningSigns: string[];
  safeActions: string[];
  genuineProcedure: string;
  officialContact?: string;
}

const authorityDatabase: Record<string, VerificationDetails> = {
  'cbi': {
    isLegitimate: false,
    warningSigns: [
      'CBI does not make initial contact via phone calls for investigations',
      'No genuine officer will ask you to stay on a video call',
      'Arrest warrants are served physically by police, not electronically',
      'Government agencies never ask for money transfers over calls',
      'Real CBI officers work in teams with proper identification',
    ],
    safeActions: [
      'Disconnect the call immediately',
      'Do not transfer any money',
      'Call your local police station to verify',
      'Report to 1930 cybercrime helpline',
      'Note down the caller\'s number for reporting',
    ],
    genuineProcedure: 'Genuine Procedure: CBI officers will visit your residence or office with an official warrant, identification badges, and a team. They never conduct proceedings over phone or video calls. You have the right to verify their credentials by contacting the nearest CBI branch.',
    officialContact: 'https://cbi.gov.in',
  },
  'income tax': {
    isLegitimate: false,
    warningSigns: [
      'Income Tax Department never calls demanding immediate payment',
      'All official notices come via registered email from @incometax.gov.in',
      'Officers never ask for OTP or bank credentials',
      'Tax demands are served with proper assessment orders',
      'No officer can impose instant penalties over calls',
    ],
    safeActions: [
      'Disconnect the call',
      'Login to incometax.gov.in to check for notices',
      'Visit your local Income Tax office in person',
      'Contact your CA to verify any claims',
      'Never share PAN/Aadhaar details on call',
    ],
    genuineProcedure: 'Genuine Procedure: Income Tax communications are sent via registered post and appear in your e-filing portal inbox. Any tax demand includes detailed assessment orders with appeal periods. Payment is only accepted through official government portals, never via UPI to personal accounts.',
    officialContact: 'https://incometax.gov.in',
  },
  'police': {
    isLegitimate: false,
    warningSigns: [
      'Police cannot issue arrest warrants over phone calls',
      'Warrants are physical documents served in person',
      'No legitimate officer demands payment to "cancel" warrants',
      'Police do not conduct investigations via video calls',
      'Real police always provide station details and badge numbers',
    ],
    safeActions: [
      'Hang up immediately',
      'Never pay any "fine" or "penalty"',
      'Call your local police station landline to verify',
      'Dial 100 if you feel threatened',
      'Report the incident to cybercrime.gov.in',
    ],
    genuineProcedure: 'Genuine Procedure: If there is a warrant against you, police officers will visit your residence with the physical warrant document. You will be given a copy and time to consult with a lawyer. Police never demand immediate payment over calls.',
    officialContact: 'tel:100',
  },
  'court': {
    isLegitimate: false,
    warningSigns: [
      'Courts never make phone calls about warrants or summons',
      'All court documents are served physically through process servers',
      'No court official will demand payment over phone',
      'Court proceedings require physical presence or video conference via official channels',
      'Notices come through registered post with court seal',
    ],
    safeActions: [
      'Disconnect the call',
      'Do not transfer any money',
      'Visit nearest court with your advocate if concerned',
      'Call the court\'s official landline to verify',
      'Report the fake call to local police',
    ],
    genuineProcedure: 'Genuine Procedure: Court notices, summons, and warrants are served physically by court officials or through registered post. Each document carries a unique case number (CNR) that can be verified on the court\'s official website. Never arrange payment based on phone calls.',
    officialContact: 'https://districts.ecourts.gov.in',
  },
  'bank': {
    isLegitimate: false,
    warningSigns: [
      'Banks never ask for ATM PIN, CVV, or OTP',
      'Bank officials do not request remote access to your devices',
      'No legitimate banker will ask you to scan QR codes for refunds',
      'Official callers will have your account details already',
      'Banks never ask for card photocopies over phone',
    ],
    safeActions: [
      'Do not share any personal details',
      'Call your bank\'s official number from your passbook',
      'Visit the branch in person',
      'Block your card if you shared any details',
      'Check for alerts in your banking app',
    ],
    genuineProcedure: 'Genuine Procedure: For account issues, banks communicate via official SMS from 3-4 digit numbers and email from @bankname.com domains. For verification, banks may ask security questions but never for OTP/PIN. Always call back using the number on your passbook/card.',
    officialContact: 'https://www.sbi.co.in or your bank\'s official site',
  },
  'gst': {
    isLegitimate: false,
    warningSigns: [
      'GST departments send official notices via portal and registered post',
      'No official demands immediate payment over phone',
      'GST communications come from gst.gov.in addresses',
      'Due process includes notice periods and hearing opportunities',
      'Payment is only through GST portal, not personal accounts',
    ],
    safeActions: [
      'Disconnect the call',
      'Login to services.gst.gov.in to check for notices',
      'Contact your tax consultant/CA',
      'Visit the nearest GST office',
      'Report to cybercrime helpline 1930',
    ],
    genuineProcedure: 'Genuine Procedure: GST notices appear in your GST portal dashboard and are sent by registered post. Any demand order includes appeal rights and timelines. Payment is processed only through the official GST portal to government accounts, never to individual UPI IDs.',
    officialContact: 'https://gst.gov.in',
  },
  'enforcement directorate': {
    isLegitimate: false,
    warningSigns: [
      'ED does not conduct initial contact via phone',
      'ED officers never demand payment to "close" cases',
      'Summonses are delivered physically with official letterhead',
      'No ED officer will ask you to transfer money',
      'Investigations follow documented due process',
    ],
    safeActions: [
      'Hang up immediately',
      'Never transfer money based on phone calls',
      'Contact nearest ED office to verify',
      'Consult with your advocate',
      'Report to local police and 1930',
    ],
    genuineProcedure: 'Genuine Procedure: ED summonses are physically delivered on official letterhead with the ED seal. You receive time to consult with your advocate. ED conducts investigations through proper channels with documentation. No proceedings happen over phone or video calls.',
    officialContact: 'https://enforcementdirectorate.gov.in',
  },
  'post office': {
    isLegitimate: false,
    warningSigns: [
      'India Post never calls about package issues demanding payment',
      'Courier charges are paid at delivery, not remotely',
      'No official asks for OTP or UPI for delivery',
      'Customs dues are paid at post office, not via phone',
    ],
    safeActions: [
      'Do not share any details',
      'Check your package status on official website',
      'Visit nearest post office',
      'Call India Post helpline 1800-2666',
    ],
    genuineProcedure: 'Genuine Procedure: For customs or package issues, India Post sends physical notices. Payment is made at the post office counter with receipt. Verify package status through the official India Post website or SMS updates.',
    officialContact: 'https://indiapost.gov.in',
  },
};

const quickQuestions = [
  { text: 'CBI officer calling about investigation', keyword: 'cbi' },
  { text: 'Income Tax demanding immediate payment', keyword: 'income tax' },
  { text: 'Police calling about arrest warrant', keyword: 'police' },
  { text: 'Bank asking for OTP/PIN', keyword: 'bank' },
  { text: 'Court summons over phone', keyword: 'court' },
  { text: 'GST officer demanding dues', keyword: 'gst' },
];

function verifyAuthority(query: string): VerificationDetails {
  const lowerQuery = query.toLowerCase();

  for (const [keyword, response] of Object.entries(authorityDatabase)) {
    if (lowerQuery.includes(keyword)) {
      return response;
    }
  }

  // Check for scam indicators
  const scamIndicators = ['transfer', 'pay', 'otp', 'kyc', 'blocked', 'arrest', 'warrant', 'legal action', 'immediately'];
  const indicatorCount = scamIndicators.filter(i => lowerQuery.includes(i)).length;

  return {
    isLegitimate: false,
    warningSigns: [
      'Government agencies never demand immediate payment over calls',
      'No legitimate authority asks for OTP, PIN, or bank credentials',
      'Physical documents are required for all legal proceedings',
      'You have the right to verify through official channels',
      'Scammers create urgency to prevent critical thinking',
    ],
    safeActions: [
      'Never transfer money based on phone calls',
      'Do not share OTP, PIN, or personal details',
      'Ask for official identification and office address',
      'Contact the organization through official channels',
      'Report suspicious calls to 1930',
    ],
    genuineProcedure: `General Guidance: All government agencies have official procedures. For verification, contact the organization directly using official numbers from their website. You have the right to ask for the officer's name, designation, and office address. Never make payments based solely on phone calls. When in doubt, visit the nearest office in person or dial 1930 (National Cybercrime Helpline).`,
    officialContact: 'https://cybercrime.gov.in',
  };
}

export default function AuthorityVerification() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your Authority Verification Assistant. Tell me about any suspicious calls or messages you received from people claiming to be from government agencies, banks, or authorities.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const verification = verifyAuthority(inputText);
    const details = verification;
    const summary = verification.isLegitimate
      ? 'Based on the information you provided, this appears to be a legitimate communication. However, always verify through official channels.'
      : 'Warning! This exhibits multiple signs of a scam. Please read the following details carefully.';

    const botMessage: Message = {
      id: Date.now() + 1,
      type: 'bot',
      content: summary,
      timestamp: new Date(),
      details: details,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    try {
      await supabase.from('authority_verifications').insert({
        query: userMessage.content,
        response: botMessage.content,
        is_legitimate: !verification.isLegitimate,
      });
    } catch {
      // Silently handle
    }
  };

  const handleQuickQuestion = (text: string) => {
    setInputText(`A person claiming to be ${text} contacted me.`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-5 py-2 mb-6">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">AI Verification Assistant</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Authority Verification Chatbot
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Describe any suspicious communication from officials. Our AI will analyze whether it follows genuine procedures.
          </p>
        </div>

        {/* Chatbot Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
              </div>
              <div>
                <div className="text-white font-semibold">SentinelAI Verifier</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online • Ready to help
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <BadgeCheck className="w-4 h-4" />
              Powered by verified government procedures
            </div>
          </div>

          {/* Quick Question Pills */}
          <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700/30 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <ChevronDown className="w-4 h-4" />
              Quick questions (click to ask):
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600/30 hover:border-slate-500"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Shield className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-5 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/70 text-slate-200'
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                  </div>

                  {/* Details Card (for bot messages) */}
                  {message.details && (
                    <div className="mt-4 bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden">
                      {/* Warning Banner */}
                      <div className={`flex items-center gap-3 px-4 py-3 ${
                        message.details.isLegitimate
                          ? 'bg-green-500/10 border-b border-green-500/20'
                          : 'bg-red-500/10 border-b border-red-500/20'
                      }`}>
                        {message.details.isLegitimate ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        )}
                        <span className={`font-semibold ${
                          message.details.isLegitimate ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {message.details.isLegitimate ? 'Likely Legitimate' : 'High Risk - Likely Scam'}
                        </span>
                      </div>

                      {/* Warning Signs */}
                      <div className="p-4 border-b border-slate-700/30">
                        <h5 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Warning Signs to Check
                        </h5>
                        <ul className="space-y-2">
                          {message.details.warningSigns.slice(0, 3).map((sign, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                              <span>{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Safe Actions */}
                      <div className="p-4 border-b border-slate-700/30">
                        <h5 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Safe Actions
                        </h5>
                        <ul className="space-y-2">
                          {message.details.safeActions.slice(0, 3).map((action, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-green-400">{idx + 1}</span>
                              </div>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Genuine Procedure */}
                      <div className="p-4 bg-cyan-500/5">
                        <h5 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4" />
                          GENUINE PROCEDURE
                        </h5>
                        <p className="text-sm text-slate-300 leading-relaxed">{message.details.genuineProcedure}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`text-xs text-slate-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700/70 rounded-2xl px-5 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-700/30">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe the situation... (e.g., 'Someone from CBI called about an investigation')"
                className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white px-5 py-3 rounded-xl transition-all flex items-center gap-2 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Helper Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-semibold text-white">Red Flags</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Urgent deadline to pay</li>
              <li>• Threats of arrest or legal action</li>
              <li>• Requests for OTP/PIN</li>
              <li>• Demands to stay on call</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-semibold text-white">Covered Authorities</span>
            </div>
            <p className="text-sm text-slate-400">
              CBI, Income Tax, Police, Courts, Banks, GST, Enforcement Directorate, India Post and more...
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-semibold text-white">Emergency Help</span>
            </div>
            <div className="flex flex-col gap-2">
              <a href="tel:1930" className="text-sm text-green-400 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> 1930 - Cybercrime Helpline
              </a>
              <a href="tel:100" className="text-sm text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3" /> 100 - Police Emergency
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
