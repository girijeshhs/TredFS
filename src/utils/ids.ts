export const createNodeId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};
