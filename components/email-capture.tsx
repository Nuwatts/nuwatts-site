'use client';

import { FormEvent, useMemo, useState } from 'react';

export function EmailCapture({ compact = false }: { compact?: boolean }) {
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const buttonLabel = useMemo(() => {
    if (status === 'loading') return 'Submitting…';
    if (status === 'success') return 'Sent';
    return compact ? 'Get Brief' : 'Request Technical Brief';
  }, [compact, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter an email address.');
      return;
    }

    if (!endpoint) {
      window.location.href = `mailto:hello@nuwatts.com?subject=${encodeURIComponent('Request technical brief')}&body=${encodeURIComponent(`Please send the Nuwatts technical brief to ${email}`)}`;
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'nuwatts-space-site',
          interest: 'technical-brief',
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      setMessage('Thanks — we will follow up shortly.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Email hello@nuwatts.com directly.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex w-full flex-col gap-3 sm:flex-row' : 'mt-6 flex w-full flex-col gap-3 sm:flex-row'}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/35 focus:border-cyan-300/40 focus:outline-none"
        aria-label="Email address"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {buttonLabel}
      </button>
      {message ? <p className="text-sm text-white/60 sm:basis-full">{message}</p> : null}
    </form>
  );
}
