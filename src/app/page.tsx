import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import NodeEditor from "@/components/panel/NodeEditor";
import NodePalette from "@/components/panel/NodePalette";
import WorkflowRunner from "@/components/panel/WorkflowRunner";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-zinc-50">
      <NodePalette />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">
          <WorkflowCanvas />
        </div>
        <WorkflowRunner />
      </div>
      <NodeEditor />
    </div>
  );
}
