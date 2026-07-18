import React from 'react';
import EducationCard from '../components/Education/EducationCard';
import MythFactCard from '../components/MythFact/MythFactCard';
import educationData from '../data/educationCards.json';
import mythsData from '../data/mythsFacts.json';

export default function Learn() {
  return (
    <div className="max-w-6xl mx-auto px-4 w-full py-10 flex-grow animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">AMR Learning Center</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Equip yourself with the knowledge to combat Antimicrobial Resistance. Explore key concepts and separate fact from fiction.
        </p>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px bg-slate-700 flex-grow"></div>
          <h2 className="text-2xl font-bold font-heading text-teal-400">Understanding AMR</h2>
          <div className="h-px bg-slate-700 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {educationData.map((card, idx) => (
            <div key={card.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in">
              <EducationCard card={card} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px bg-slate-700 flex-grow"></div>
          <h2 className="text-2xl font-bold font-heading text-cyan-400">Myth vs Fact</h2>
          <div className="h-px bg-slate-700 flex-grow"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {mythsData.map((data, idx) => (
            <div key={idx} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up">
              <MythFactCard data={data} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
