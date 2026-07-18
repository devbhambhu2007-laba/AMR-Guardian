import React from 'react';

const STATIC_TEXT = "This application is not a diagnostic tool. It cannot identify bacterial infection or prescribe treatment. Always consult a registered medical practitioner.";

const DYNAMIC_MESSAGES = {
  High: {
    icon: "🚨",
    color: "border-red-500 bg-red-500/10 text-red-200",
    iconBg: "bg-red-500/20 text-red-400",
    text: "Your risk level is HIGH. We strongly recommend you consult a registered medical practitioner as soon as possible to review your antibiotic usage patterns.",
    action: "⚕️ Please schedule a doctor's appointment at the earliest."
  },
  Medium: {
    icon: "⚠️",
    color: "border-amber-500 bg-amber-500/10 text-amber-200",
    iconBg: "bg-amber-500/20 text-amber-400",
    text: "Your risk level is MODERATE. Some of your antibiotic usage habits may contribute to antimicrobial resistance. Consider consulting a healthcare professional.",
    action: "💡 Discuss your antibiotic habits with a doctor at your next visit."
  },
  Low: {
    icon: "✅",
    color: "border-emerald-500 bg-emerald-500/10 text-emerald-200",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    text: "Your risk level is LOW. Your reported antibiotic usage habits appear to be within safe practices. Keep it up!",
    action: "👍 Continue following your doctor's guidance for any future antibiotic use."
  }
};

export default function Disclaimer({ variant = 'inline', riskCategory = null }) {
  // If we have a risk category, show the dynamic version
  if (riskCategory && DYNAMIC_MESSAGES[riskCategory]) {
    const msg = DYNAMIC_MESSAGES[riskCategory];
    return (
      <div className={`rounded-xl border-2 p-5 my-4 animate-fade-in ${msg.color}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl ${msg.iconBg}`}>
            {msg.icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base mb-2">{msg.text}</p>
            <p className="text-sm font-medium opacity-90">{msg.action}</p>
            <p className="text-xs opacity-60 mt-3 border-t border-white/10 pt-2">{STATIC_TEXT}</p>
          </div>
        </div>
      </div>
    );
  }

  // Static banner (used on pages without results)
  if (variant === 'banner') {
    return (
      <div className="disclaimer-banner fixed bottom-0 left-0 w-full p-4 z-50 text-center text-sm font-medium">
        <p className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{STATIC_TEXT}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card border-l-4 border-l-amber-500 p-4 my-4 flex gap-3 text-amber-200 text-sm">
      <svg className="w-6 h-6 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>{STATIC_TEXT}</p>
    </div>
  );
}
