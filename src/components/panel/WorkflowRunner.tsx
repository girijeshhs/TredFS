'use client';

import { hasStartNode, simulateWorkflow } from "@/utils/workflowSimulation";
import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowRunner() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const simulationSteps = useWorkflowStore((state) => state.simulationSteps);
  const simulationWarnings = useWorkflowStore(
    (state) => state.simulationWarnings
  );
  const setSimulationResult = useWorkflowStore(
    (state) => state.setSimulationResult
  );
  const canRun = hasStartNode(nodes);

  const hasOutput =
    simulationSteps.length > 0 || simulationWarnings.length > 0;

  const handleRun = () => {
    setSimulationResult(simulateWorkflow(nodes, edges));
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
          disabled={!canRun}
          className={`rounded-md border border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white ${
            canRun
              ? "bg-zinc-900 hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-400"
          }`}
        >
          Run Workflow
        </button>
      </div>

      <div className="mt-3 text-sm">
        {!canRun && (
          <p className="text-xs text-amber-700">
            Add a Start node to run the workflow.
          </p>
        )}
        {!hasOutput && (
          <p className="text-zinc-500">Run workflow to see output.</p>
        )}
        {hasOutput && (
          <>
            <div className="text-zinc-900">
              {simulationSteps.length > 0
                ? simulationSteps.join(" -> ")
                : "No steps generated."}
            </div>
            {simulationWarnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                {simulationWarnings.map((warning) => (
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
