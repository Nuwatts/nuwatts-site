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
    <form
  action="https://formsubmit.co/james@nuwatts.com"
  method="POST"
  className="mt-6 flex gap-3"
>
  <input
    type="email"
    name="email"
    required
    placeholder="Enter your email"
    className="flex-1 rounded-full bg-white/10 px-4 py-2 text-white placeholder-white/50 border border-white/20"
  />

  {/* Hidden fields */}
  <input type="hidden" name="_subject" value="New Nuwatts Inquiry" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_next" value="https://nuwatts.github.io/nuwatts-site/" />
  <button
    type="submit"
    className="rounded-full bg-white px-4 py-2 text-black font-semibold"
  >
    I want more information
  </button>
</form>
  );
}
