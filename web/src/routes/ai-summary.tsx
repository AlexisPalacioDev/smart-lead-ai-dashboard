import { Link, createFileRoute } from "@tanstack/react-router";

/**
 * ai-summary.tsx
 * Registers the AI Summary route placeholder used before full AI integration.
 * Depends on the shared shell and Phosphor Dark utility classes for layout.
 */

export const Route = createFileRoute("/ai-summary")({
  component: AISummaryPage,
});

/**
 * Renders the AI Summary placeholder route.
 *
 */
function AISummaryPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <article className="terminal-panel rise-in space-y-6 p-6 lg:p-10">
        <div className="space-y-4">
          <p className="terminal-eyebrow">AI Briefing</p>
          <h2 className="terminal-heading">AI Summary</h2>
          <p className="terminal-copy">
            This surface is reserved for executive synthesis: filtered lead
            context in, concise recommendations out. No chat shell, no table
            duplication.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="terminal-link terminal-link--primary"
            to="/ai-summary"
          >
            [ GENERATE SUMMARY ]
          </Link>
          <Link className="terminal-link" to="/leads">
            [ RETURN TO DIRECTORY ]
          </Link>
        </div>
      </article>
      <article className="terminal-panel--high p-6 lg:p-10">
        <p className="terminal-eyebrow">Output Layout</p>
        <div className="mt-4 grid gap-4">
          <div className="terminal-metric p-4">
            <p className="terminal-eyebrow">General Analysis</p>
          </div>
          <div className="terminal-metric p-4">
            <p className="terminal-eyebrow">Main Source</p>
          </div>
          <div className="terminal-metric p-4">
            <p className="terminal-eyebrow">Recommendations</p>
          </div>
        </div>
      </article>
    </section>
  );
}
