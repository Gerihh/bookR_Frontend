export interface NodeModel {
  name: string;
  description: string;
  elementId: number;
  parentNodeId: number | null;
  children?: NodeModel[];
  positionX?: number;
  positionY?: number;
}
