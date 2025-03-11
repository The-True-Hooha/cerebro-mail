'use client';

import { useState } from 'react';
import WaitlistForm from '../waitlist/waitlist-action';

export default function WaitlistButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-hotOrange hover:bg-hotOrange/90 group hover:cursor-pointer flex items-center justify-center rounded-md w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 font-medium text-white shadow-md transition-colors hover:shadow-lg"
      >
        <span className="mr-2">Join Waitlist</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 m-4 relative">
            <div 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-700 z-50 bg-hotOrange hover:cursor-pointer rounded-full p-1"
            >
                
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 z-50 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <WaitlistForm onComplete={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
