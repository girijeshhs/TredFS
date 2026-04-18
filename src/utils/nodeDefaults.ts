import type {
  NodeDataByType,
  NodeType,
  WorkflowNode,
  WorkflowNodeByType,
} from "@/store/types";

const defaultNodeData: NodeDataByType = {
  start: { label: "Start" },
  task: { label: "Task", title: "", description: "", assignee: "" },
  approval: {
    label: "Approval",
    title: "",
    approverRole: "",
    threshold: 0,
  },
  end: { label: "End" },
};

export const getDefaultNodeData = <T extends NodeType>(
  type: T
): NodeDataByType[T] => ({ ...defaultNodeData[type] } as NodeDataByType[T]);

export const normalizeNodeData = <T extends NodeType>(
  type: T,
  data?: Partial<NodeDataByType[T]>
): NodeDataByType[T] => ({
  ...getDefaultNodeData(type),
  ...(data ?? {}),
});

export function normalizeNode(
  node: WorkflowNodeByType["start"]
): WorkflowNodeByType["start"];
export function normalizeNode(
  node: WorkflowNodeByType["task"]
): WorkflowNodeByType["task"];
export function normalizeNode(
  node: WorkflowNodeByType["approval"]
): WorkflowNodeByType["approval"];
export function normalizeNode(
  node: WorkflowNodeByType["end"]
): WorkflowNodeByType["end"];
export function normalizeNode(node: WorkflowNode): WorkflowNode {
  return {
    ...node,
    data: normalizeNodeData(node.type, node.data),
  } as WorkflowNode;
}

export function createWorkflowNode(
  params: {
    id: string;
    type: "start";
    position: { x: number; y: number };
    data?: Partial<NodeDataByType["start"]>;
  }
): WorkflowNodeByType["start"];
export function createWorkflowNode(
  params: {
    id: string;
    type: "task";
    position: { x: number; y: number };
    data?: Partial<NodeDataByType["task"]>;
  }
): WorkflowNodeByType["task"];
export function createWorkflowNode(
  params: {
    id: string;
    type: "approval";
    position: { x: number; y: number };
    data?: Partial<NodeDataByType["approval"]>;
  }
): WorkflowNodeByType["approval"];
export function createWorkflowNode(
  params: {
    id: string;
    type: "end";
    position: { x: number; y: number };
    data?: Partial<NodeDataByType["end"]>;
  }
): WorkflowNodeByType["end"];
export function createWorkflowNode(params: {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data?: Partial<NodeDataByType[NodeType]>;
}): WorkflowNode {
  return {
    id: params.id,
    type: params.type,
    position: params.position,
    data: normalizeNodeData(params.type, params.data),
  } as WorkflowNode;
}

export const isNodeType = (value: string | undefined): value is NodeType =>
  value === "start" ||
  value === "task" ||
  value === "approval" ||
  value === "end";
