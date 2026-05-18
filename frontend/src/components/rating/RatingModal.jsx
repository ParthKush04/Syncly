import { useMemo, useState } from 'react';
import { submitConversationRating } from '../../services/ratingService.js';

function StarRating({ value, onChange, label }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`h-11 w-11 rounded-2xl border text-sm font-semibold transition ${
              star <= value
                ? 'border-cyan-200 bg-cyan-500 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:bg-cyan-50'
            }`}
          >
            {star}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatingModal({ open, onClose, sessionId = '', ratedUserId = '' }) {
  const [sessionValue, setSessionValue] = useState(sessionId);
  const [ratedUserValue, setRatedUserValue] = useState(ratedUserId);
  const [conversationRating, setConversationRating] = useState(4);
  const [professionalismScore, setProfessionalismScore] = useState(4);
  const [helpfulness, setHelpfulness] = useState(true);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const overallImpact = useMemo(() => {
    const helpfulnessImpact = helpfulness ? 20 : 0;
    return Math.round(((conversationRating / 5) * 45) + ((professionalismScore / 5) * 35) + helpfulnessImpact);
  }, [conversationRating, helpfulness, professionalismScore]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitConversationRating({
        sessionId: sessionValue,
        ratedUserId: ratedUserValue,
        conversationRating,
        helpfulness,
        professionalismScore,
        comment
      });

      setSuccessMessage('Rating submitted successfully.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/30 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Conversation rating</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Rate the session</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Share how helpful and professional the conversation felt so the network can improve match quality.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Session ID</span>
              <input
                value={sessionValue}
                onChange={(event) => setSessionValue(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                placeholder="session-id"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Rated user ID</span>
              <input
                value={ratedUserValue}
                onChange={(event) => setRatedUserValue(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                placeholder="user-id"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StarRating label="Conversation rating" value={conversationRating} onChange={setConversationRating} />
            <StarRating label="Professionalism score" value={professionalismScore} onChange={setProfessionalismScore} />
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-slate-700">Was the conversation helpful?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setHelpfulness(true)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  helpfulness
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p className="font-semibold">Helpful</p>
                <p className="mt-1 text-sm text-inherit/80">The conversation moved things forward.</p>
              </button>

              <button
                type="button"
                onClick={() => setHelpfulness(false)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  !helpfulness
                    ? 'border-rose-100 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p className="font-semibold">Unhelpful</p>
                <p className="mt-1 text-sm text-inherit/80">The conversation did not meet expectations.</p>
              </button>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Comment</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
              placeholder="What went well? What could be improved?"
            />
          </label>

          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Estimated reputation impact</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">+{overallImpact}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Submit rating'}
              </button>
            </div>
          </div>

          {successMessage ? <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">{successMessage}</p> : null}
          {errorMessage ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">{errorMessage}</p> : null}
        </form>
      </div>
    </div>
  );
}
