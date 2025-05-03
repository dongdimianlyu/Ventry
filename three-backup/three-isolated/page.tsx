'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Load the isolated component dynamically
const ThreeContent = dynamic(() => import('./three-content'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-black text-white">
      Loading Three.js content...
    </div>
  ) 
});

export default function IsolatedTestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Isolated Three.js Test</h1>
      <p className="mb-6">This page tests a completely isolated Three.js component.</p>
      
      <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg">
        <ThreeContent />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          If this component renders successfully, Three.js is working correctly.
        </p>
      </div>
    </div>
  );
} 