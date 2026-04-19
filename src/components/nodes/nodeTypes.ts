import type { NodeTypes } from "reactflow";

import ApprovalNode from "./ApprovalNode";
import AutomatedNode from "./AutomatedNode";
import EndNode from "./EndNode";
import StartNode from "./StartNode";
import TaskNode from "./TaskNode";

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

export default nodeTypes;
