'use client';

import React from 'react';
import SwapStable from './SwapStable.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-800">
          Tempo Swap Stablecoin
        </h1>
        <SwapStable />
      </div>
    </div>
  );
}