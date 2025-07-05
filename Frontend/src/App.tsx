import React from 'react';
import Header from './components/Header';
import WelcomeCard from './components/WelcomeCard';
import VoiceInteraction from './components/VoiceInteraction';
import QuickAccessChips from './components/QuickAccessChips';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-green-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeCard />
        <VoiceInteraction />
        <QuickAccessChips />
        <CallToAction />
        <Footer />
      </main>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;