import type { NodeTypes } from "reactflow";

import ApprovalNode from "./ApprovalNode";
import EndNode from "./EndNode";
import StartNode from "./StartNode";
import TaskNode from "./TaskNode";

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  end: EndNode,
};

export default nodeTypes;
