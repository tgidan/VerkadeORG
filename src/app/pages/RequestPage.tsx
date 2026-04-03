import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface FormData {
  name: string;
  email: string;
  reason: string;
}

const DAY_PICKER_STYLES = `
  .rdp {
    --rdp-cell-size: 38px;
    --rdp-accent-color: #22d3ee;
    --rdp-background-color: #1c2333;
    color: #e5e7eb;
    margin: 0;
  }
  .rdp-day:hover:not([disabled]):not(.rdp-day_selected) { background: #1c2333; color: #22d3ee; }
  .rdp-day_selected,
  .rdp-day_selected:hover { background: #22d3ee !important; color: #0a0e1a !important; border-radius: 6px; }
  .rdp-nav_button { color: #9ca3af; }
  .rdp-nav_button:hover { background: #1c2333; color: #22d3ee; }
  .rdp-head_cell { color: #6b7280; font-weight: 500; }
  .rdp-caption_label { color: #e5e7eb; font-size: 0.875rem; }
  .rdp-day_disabled { color: #374151 !important; cursor: not-allowed; }
  .rdp-day_outside { color: #4b5563; }
  .rdp-day_today:not(.rdp-day_selected) { color: #22d3ee; font-weight: 700; }
`;

export function RequestPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!date) {
      toast.error('Please select a date.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/send-request.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:   data.name,
          email:  data.email,
          date:   format(date, 'PPPP'),
          reason: data.reason,
        }),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error('Failed to send request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const monoFont = { fontFamily: '"JetBrains Mono", monospace' };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center p-8"
        style={monoFont}
      >
        <div className="text-center space-y-3">
          <p className="text-gray-600 text-xs">$ request --send</p>
          <p className="text-cyan-400 text-2xl font-bold tracking-widest">REQUEST SENT</p>
          <p className="text-gray-400 text-sm">
            Your request has been forwarded to Daan Verkade.
          </p>
          <p className="text-gray-600 text-xs">Expect a reply at your provided email address.</p>
          <a
            href="/"
            className="inline-block mt-4 text-cyan-400/70 text-xs hover:text-cyan-400 transition-colors"
          >
            ← return to verkade.org
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white py-16 px-4" style={monoFont}>
      <style>{DAY_PICKER_STYLES}</style>
      <Toaster theme="dark" position="top-center" />

      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/"
            className="text-gray-600 text-xs hover:text-cyan-400 transition-colors"
          >
            ← verkade.org
          </a>
          <h1
            className="text-3xl font-bold text-white mt-5"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Request Presence
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill in the form to request Daan Verkade's presence.
          </p>
          <div className="h-px bg-cyan-400/20 mt-6" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register('name', {
                required: 'Name is required.',
                minLength: { value: 2, message: 'Name must be at least 2 characters.' },
              })}
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              placeholder="Your full name"
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              {...register('email', {
                required: 'Email address is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.',
                },
              })}
              type="email"
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
              placeholder="your@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Requested Date <span className="text-red-400">*</span>
            </label>
            <div className="bg-[#0d1117] border border-white/10 rounded-lg p-4 inline-block">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ before: new Date() }}
                showOutsideDays={false}
              />
            </div>
            {date ? (
              <p className="text-cyan-400 text-xs mt-2">{format(date, 'PPPP')}</p>
            ) : (
              <p className="text-gray-600 text-xs mt-2">No date selected</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('reason', {
                required: 'Reason is required.',
                minLength: {
                  value: 10,
                  message: 'Please provide more detail (at least 10 characters).',
                },
              })}
              rows={5}
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              placeholder="Describe why you need Daan's presence..."
            />
            {errors.reason && (
              <p className="text-red-400 text-xs mt-1.5">{errors.reason.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 px-6 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-400/20 hover:border-cyan-400/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
