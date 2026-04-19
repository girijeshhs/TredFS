"use client";

import { useRef, useState } from "react";

import { useWorkflowSimulation } from "@/hooks/useWorkflowSimulation";
import type { WorkflowEdge, WorkflowNode } from "@/store/types";
import { useWorkflowStore } from "@/store/workflowStore";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isWorkflowNode = (value: unknown): value is WorkflowNode => {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string" || typeof value.type !== "string") {
    return false;
  }

  if (!isObject(value.position)) {
    return false;
  }

  if (
    typeof value.position.x !== "number" ||
    typeof value.position.y !== "number"
  ) {
    return false;
  }

  return isObject(value.data);
};

const isWorkflowEdge = (value: unknown): value is WorkflowEdge => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.source === "string" &&
    typeof value.target === "string"
  );
};

const isWorkflowPayload = (
  value: unknown
): value is { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  if (!isObject(value)) {
    return false;
  }

  return (
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges) &&
    value.nodes.every(isWorkflowNode) &&
    value.edges.every(isWorkflowEdge)
  );
};

export default function WorkflowRunner() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const { result, warnings, isLoading, runSimulation } = useWorkflowSimulation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const hasOutput = result.steps.length > 0 || warnings.length > 0;

  const handleRun = async () => {
    await runSimulation({ nodes, edges });
  };

  const handleExport = () => {
    const payload = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "workflow-export.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (!isWorkflowPayload(parsed)) {
        setImportError("Invalid workflow file structure.");
        setImportSuccess(null);
        return;
      }

      setNodes(parsed.nodes);
      setEdges(parsed.edges);
      setSelectedNode(null);
      setImportError(null);
      setImportSuccess("Workflow imported successfully");
    } catch {
      setImportError("Unable to import workflow file.");
      setImportSuccess(null);
    }
  };

  return (
    <section className="border-t border-zinc-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Simulation
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            Workflow Output
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
          >
            Export Workflow
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50"
          >
            Import Workflow
          </button>
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
      </div>

      <div className="mt-3 text-sm">
        {importSuccess && <p className="mb-2 text-xs text-emerald-700">{importSuccess}</p>}
        {importError && <p className="mb-2 text-xs text-amber-700">{importError}</p>}
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
            {warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                {warnings.map((warning) => (
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
