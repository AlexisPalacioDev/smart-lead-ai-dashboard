import type { SummaryResult as SummaryResultValue } from "../../features/ai/application/summary-ports";

/**
 * summary-result.tsx
 * Displays the structured AI output once the summary request succeeds.
 */

type SummaryResultProps = {
  result: SummaryResultValue;
};

export function SummaryResult({ result }: SummaryResultProps) {
  return (
    <article className="terminal-panel space-y-6 p-6 lg:p-8">
      <section className="space-y-3">
        <p className="terminal-eyebrow">Analisis general</p>
        <p className="terminal-copy">{result.analysis}</p>
      </section>
      <section className="terminal-metric space-y-3 p-5">
        <p className="terminal-eyebrow">Fuente principal</p>
        <p className="terminal-metric-value">{result.mainSource}</p>
      </section>
      <section className="space-y-3">
        <p className="terminal-eyebrow">Recomendaciones</p>
        <ul className="grid gap-3">
          {result.recommendations.map((item) => (
            <li key={item} className="terminal-metric p-4 text-sm leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
