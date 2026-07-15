import { Shield, ExternalLink, Mail, Phone, MapPin, Heart, Github, Twitter } from 'lucide-react';

const footerLinks = {
  about: [
    { label: 'About SentinelAI', href: '#' },
    { label: 'How It Works', href: '#' },
    { label: 'Our Mission', href: '#' },
    { label: 'Press & Media', href: '#' },
  ],
  resources: [
    { label: 'Fraud Prevention Guide', href: '#' },
    { label: 'Cyber Safety Tips', href: '#' },
    { label: 'Report Cybercrime', href: 'https://cybercrime.gov.in' },
    { label: '1930 Helpline', href: 'tel:1930' },
  ],
  safety: [
    { label: 'Digital Arrest Awareness', href: '#' },
    { label: 'Banking Fraud Prevention', href: '#' },
    { label: 'Phishing Protection', href: '#' },
    { label: 'Identity Theft Guide', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Disclaimer', href: '#' },
    { label: 'Accessibility', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">SentinelAI</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Empowering citizens with AI-powered fraud detection and protection against digital scams.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                    {link.href.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Safety Guides</h4>
            <ul className="space-y-2">
              {footerLinks.safety.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-slate-500 text-xs">Email</div>
                <div className="text-white text-sm">support@sentinelai.in</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-slate-500 text-xs">Helpline</div>
                <div className="text-white text-sm">1800-XXX-XXXX (Toll Free)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-slate-500 text-xs">Location</div>
                <div className="text-white text-sm">Digital India Initiative</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-t border-red-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Public Safety Information</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a
                href="tel:1930"
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Cyber Helpline: 1930
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="tel:100"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Police: 100
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
              >
                Report Online
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for citizen safety</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} SentinelAI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
