import React from 'react';



export default function Shimmer() {



  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start py-12 px-4 md:px-10 bg-[#0b0b1e] bg-linear-to-t from-black/40 to-[#9a9ad2]/30 animate-pulse">
      
      {/* Header Loading Track */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 w-full md:w-1/3">
          {/* Back button circle placeholder */}
          <div className="w-11 h-11 bg-white/10 rounded-full shrink-0" />
          {/* Headline placeholder */}
          <div className="h-6 bg-white/10 rounded-xl w-full" />
        </div>
        {/* Banner notification block */}
        <div className="h-9 bg-white/5 border border-white/5 rounded-xl w-full md:w-1/3 hidden md:block" />
      </div>

      {/* Profile Card Grid Placeholders */}
      <div className="w-full max-w-3xl flex flex-wrap justify-center items-center gap-6 mt-7 mb-8">
        {/* Card 1 Placeholder */}
        <div className="w-50 h-60 lg:w-55 lg:h-65 bg-white/5 border border-white/5 rounded-2xl" />
        {/* Card 2 Placeholder */}
        <div className="w-50 h-60 lg:w-55 lg:h-65 bg-white/5 border border-white/5 rounded-2xl" />
        {/* Card 3 (Upload Block) Placeholder */}
        <div className="w-50 h-60 lg:w-55 lg:h-65 bg-white/5 border border-white/5 rounded-2xl" />
      </div>

      {/* Input Form Controls Placeholders */}
      <div className="w-full max-w-md flex flex-col gap-4 items-center">
        {/* Name input box placeholder */}
        <div className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-xl" />
        {/* CTA Button placeholder */}
        <div className="w-full h-14 bg-white/10 rounded-xl" />
      </div>

    </div>
  );
}