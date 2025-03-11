'use client';

import React, { useState } from 'react';

export default function WaitlistForm({ onComplete }: { onComplete: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !name) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, useCase }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setStatus('success');
      setEmail('');
      setName('');
      setUseCase('');
    } catch (error) {
      setStatus('error');
    }
  };

  const useCaseOptions = [
    'Newsletters',
    'Marketing Campaigns',
    'Transactional Emails',
    'Cold email Outreach',
    'Automated Sequences',
    'Other',
  ];

  if (status === 'success') {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-medium text-green-800">You're on the list!</h3>
        <p className="text-green-700">Thanks for joining our waitlist. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-lg border border-neutral-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="focus:ring-hotOrange focus:border-hotOrange text-smokyBlack w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
            placeholder="what should we call you?"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:ring-hotOrange text-smokyBlack focus:border-hotOrange w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="useCase" className="mb-1 block text-sm font-medium text-gray-700">
            What will you use Cerebro Mail for?
          </label>
          <select
            id="useCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="focus:ring-hotOrange text-smokyBlack focus:border-hotOrange w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none"
          >
            <option value="">Select an option</option>
            {useCaseOptions.map((option) => (
              <option className="text-smokyBlack" key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`bg-hotOrange hover:bg-hotOrange/90 focus:ring-hotOrange mt-6 flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          status === 'loading' ? 'cursor-not-allowed opacity-70' : ''
        }`}
      >
        {status === 'loading' ? (
          <>
            <svg
              className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          'Join Waitlist'
        )}
      </button>

      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <p className="mt-3 text-center text-xs text-gray-500">
        We'll never share your information with third parties.
      </p>
    </form>
  );
}
