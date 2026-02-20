import { useState } from 'react'

type ConsentResult = 'accepted' | 'declined' | null

export function CookieBanner() {
  const [acknowledged, setAcknowledged] = useState(false)
  const [consent, setConsent] = useState<ConsentResult>(null)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              We use cookies
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              This site uses cookies to improve your browsing experience.
              Please review our cookie policy and indicate your preference below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {consent ? (
          <p className="mt-4 text-sm font-medium text-green-600" role="status">
            Cookies {consent}!
          </p>
        ) : (
          <>
            {/* Bug: pointer-events-none via Tailwind class makes the checkbox
                unclickable in a real browser, so users can never check it
                and can only ever Decline. JSDOM doesn't process stylesheets,
                so even userEvent.click() toggles the checkbox regardless. */}
            <label className="mt-4 flex items-center gap-2 cursor-pointer select-none pointer-events-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I have read the cookie policy
              </span>
            </label>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (acknowledged) setConsent('accepted')
                }}
                style={{ opacity: acknowledged ? 1 : 0.5 }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setConsent('declined')}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Decline
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
