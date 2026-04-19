"use client";

import { useState } from "react";

import { simulateWorkflowAPI } from "@/api/mock";
import type { SimulationResult } from "@/store/types";
import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowRunner() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const [result, setResult] = useState<SimulationResult>({
    steps: [],
    warnings: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const hasOutput = result.steps.length > 0 || result.warnings.length > 0;

  const handleRun = async () => {
    setIsLoading(true);

    try {
      const simulation = await simulateWorkflowAPI({ nodes, edges });
      setResult(simulation);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="border-t border-zinc-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Simulation
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Workflow Output
          </div>
        </div>
        <button
          type="button"
          onClick={handleRun}
          disabled={isLoading}
          className={`rounded-md border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white ${
            !isLoading
              ? "bg-zinc-900 hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-400"
          }`}
        >
          {isLoading ? "Running..." : "Run Workflow"}
        </button>
      </div>

      <div className="mt-3 text-sm">
        {!hasOutput && (
          <p className="text-zinc-500">Run workflow to see output.</p>
        )}
        {hasOutput && (
          <>
            <div className="text-zinc-900">
              {result.steps.length > 0
                ? result.steps.join(" -> ")
                : "No steps generated."}
            </div>
            {result.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
