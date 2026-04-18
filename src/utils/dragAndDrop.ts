import type { NodeType } from "@/store/types";
import { isNodeType } from "@/utils/nodeDefaults";

export const NODE_DRAG_TYPE = "application/reactflow";

export const getDraggedNodeType = (
  dataTransfer: DataTransfer
): NodeType | null => {
  const type = dataTransfer.getData(NODE_DRAG_TYPE);
  return isNodeType(type) ? type : null;
};
