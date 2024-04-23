export interface NodeModel {
  id: number;
  name: string;
  description: string;
  elementId: number;
  parentNodeId: number | null;
  children?: NodeModel[];
}
