/**
 * ai-summary.tsx
 * Defines the AI Summary route and page state flow. Prompt composition and
 * OpenAI transport stay outside the UI layer.
 */
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

// Components
import { SummaryFilters } from "../components/ai/summary-filters";
import { SummaryResult } from "../components/ai/summary-result";
import { SummaryState } from "../components/ai/summary-state";
import { PageHeader } from "../components/ui/page-header";
// Application
import { createSummaryUseCase } from "../features/ai/application/create-summary-use-case";
import { filterLeads } from "../features/leads/application/lead-filters";
import { getLeadSourceLabel } from "../features/leads/application/lead-source-labels";
import { createLeadUseCases } from "../features/leads/application/lead-use-cases";
// Types
import type {
  SummaryFilters as SummaryFilterValues,
  SummaryResult as SummaryResultValue,
} from "../features/ai/application/summary-ports";
// Infrastructure
import { summaryService } from "../features/ai/infrastructure/summary-service";
import { leadFixtures } from "../features/leads/infrastructure/lead-fixtures";
import { createLeadsRepository } from "../features/leads/infrastructure/leads-repository";

const SUMMARY_QUERY_KEY = ["leads", "summary"] as const;
const DEFAULT_SUMMARY_FILTERS: SummaryFilterValues = {
  source: "all",
  startDate: "",
  endDate: "",
};
type SummarySourceOption = {
  label: string;
  value: SummaryFilterValues["source"];
};

const leadUseCases = createLeadUseCases(createLeadsRepository());
const summaryUseCase = createSummaryUseCase(summaryService);
const SOURCE_OPTIONS: SummarySourceOption[] = [
  { value: "all", label: "Todas" },
  ...(
    ["instagram", "facebook", "landing_page", "referido", "otro"] as const
  ).map((source) => ({
    value: source,
    label: getLeadSourceLabel(source),
  })),
];

type CreateSummaryInput = Parameters<typeof summaryUseCase.execute>[0];

export const Route = createFileRoute("/ai-summary")({
  component: AISummaryRoute,
});

/**
 * Loads lead data for the route and hands the filtered-summary workflow to the
 * stateful page component.
 */
function AISummaryRoute() {
  const leadsQuery = useQuery({
    queryKey: SUMMARY_QUERY_KEY,
    queryFn: leadUseCases.listLeads,
  });

  if (leadsQuery.isLoading) {
    return <AISummaryScaffold body={<SummaryState status="loading" />} />;
  }

  if (leadsQuery.isError) {
    return (
      <AISummaryScaffold
        body={
          <SummaryState
            status="error"
            errorMessage="No fue posible cargar los leads del resumen."
            onRetry={() => {
              void leadsQuery.refetch();
            }}
          />
        }
      />
    );
  }

  if (!leadsQuery.data || leadsQuery.data.length === 0) {
    return <AISummaryScaffold body={<SummaryState status="empty" />} />;
  }

  return <AISummaryPage leads={leadsQuery.data} />;
}

/**
 * Manages local AI generation state for already-loaded leads.
 */
export function AISummaryPage({
  leads = leadFixtures,
  createSummary = summaryUseCase.execute,
}: {
  leads?: CreateSummaryInput["leads"];
  createSummary?: (input: CreateSummaryInput) => Promise<SummaryResultValue>;
}) {
  const [filters, setFilters] = useState(DEFAULT_SUMMARY_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResultValue | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const filteredLeads = useMemo(
    () => filterLeads(leads, { query: "", ...filters }),
    [filters, leads],
  );

  const handleFilterChange = (next: Partial<SummaryFilterValues>) => {
    setFilters((previous) => ({ ...previous, ...next }));
    setResult(null);
    setErrorMessage(null);
  };

  const handleGenerate = async () => {
    if (filteredLeads.length === 0) {
      setResult(null);
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const nextResult = await createSummary({ leads: filteredLeads, filters });
      setResult(nextResult);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const body = isLoading ? (
    <SummaryState status="loading" />
  ) : result ? (
    <SummaryResult result={result} />
  ) : errorMessage ? (
    <SummaryState
      status="error"
      errorMessage={errorMessage}
      onRetry={() => {
        void handleGenerate();
      }}
    />
  ) : filteredLeads.length === 0 ? (
    <SummaryState status="empty" />
  ) : (
    <SummaryState status="idle" />
  );

  return (
    <AISummaryScaffold
      body={
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SummaryFilters
            filters={filters}
            sourceOptions={SOURCE_OPTIONS}
            leadCount={filteredLeads.length}
            isLoading={isLoading}
            onChange={handleFilterChange}
            onGenerate={() => {
              void handleGenerate();
            }}
          />
          {body}
        </div>
      }
    />
  );
}

function AISummaryScaffold({ body }: { body: React.ReactNode }) {
  return (
    <section aria-labelledby="ai-summary-route-title" className="space-y-8">
      <PageHeader
        headingId="ai-summary-route-title"
        title="Resumen con IA"
        description="Genera un resumen ejecutivo del pipeline usando OpenAI."
      />
      {body}
    </section>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible generar el resumen.";
}
