import HeroSection from './components/HeroSection';
import ScamAnalyzer from './components/ScamAnalyzer';
import AuthorityVerification from './components/AuthorityVerification';
import EmergencyAssistant from './components/EmergencyAssistant';
import StatisticsSection from './components/StatisticsSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <HeroSection />
      <ScamAnalyzer />
      <AuthorityVerification />
      <EmergencyAssistant />
      <StatisticsSection />
      <Footer />
    </div>
  );
}

export default App;
