'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isSecure, setIsSecure] = useState(true);
  const [errorType, setErrorType] = useState<'devtools' | 'browser' | 'iframe' | null>(null);

  useEffect(() => {
    // Check security status
    const checkSecurity = () => {
      // 1. Block iFrames (Runtime check)
      const allowedDomains = ['google.com', 'classx.co.in', 'run.app', 'localhost', 'asia-southeast1.run.app'];
      const isAllowed = allowedDomains.some(domain => window.location.hostname.includes(domain));

      if (window.self !== window.top && !isAllowed) {
        setIsSecure(false);
        setErrorType('iframe');
        return true;
      }

      // 2. Browser Check
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isTelegram = /Telegram/i.test(ua);
      const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Messenger/i.test(ua);

      if (isTelegram || isInApp) {
        setIsSecure(false);
        setErrorType('browser');
        return true;
      }
      return false;
    };

    const hasSecurityIssue = checkSecurity();
    if (hasSecurityIssue) return;

    // 3. Anti-DevTools & Keyboard Shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12
      if (e.key === 'F12') e.preventDefault();
      // Disable Ctrl+Shift+I, J, C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
      // Disable Ctrl+S
      if (e.ctrlKey && e.key === 's') e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // 4. Subtle DevTools detection (can be annoying, but satisfying the user request)
    const devtoolsDetector = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        // We don't necessarily block it here to avoid false positives on zoom,
        // but we could if we wanted to be extreme.
      }
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devtoolsDetector);
    };
  }, []);

  if (!isSecure) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-2">Security Protection Active</h1>
        
        {errorType === 'browser' && (
          <div className="max-w-md">
            <p className="text-gray-500 mb-8 font-medium">
              You are using a restricted browser. For your security, Sachin Academy only works on official browsers like Google Chrome.
            </p>
            <Button 
               onClick={() => window.open('googlechrome://', '_blank')}
               className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-blue-200 flex items-center space-x-3 w-full"
            >
              <Globe className="w-5 h-5" />
              <span>Open in Google Chrome</span>
            </Button>
            <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Please copy the URL and paste it into Chrome
            </p>
          </div>
        )}

        {errorType === 'iframe' && (
          <div className="max-w-md">
            <p className="text-gray-500 mb-8 font-medium">
              Access denied. Sachin Academy cannot be viewed inside an iFrame for security reasons.
            </p>
            <Button 
               onClick={() => window.open(window.location.href, '_blank')}
               className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-blue-200 w-full"
            >
              Open Official Website
            </Button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-xs">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            Security Verified by Sachin Academy
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        body {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
      {children}
    </>
  );
}
