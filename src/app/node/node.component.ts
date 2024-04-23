import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { NodeModel } from '../node-model';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrl: './node.component.css',
})
export class NodeComponent implements OnInit {
  @Input() nodes: NodeModel[] = [];
  name: string = '';

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.name = params['name'];
    });

    this.httpService.getElementNodes(this.name).subscribe({
      next: (result: NodeModel[]) => {
        this.nodes = this.organizeNodes(result); // Use organizeNodes to structure nodes
      },
      error: (err: any) => console.log(err),
    });
  }

  organizeNodes(nodes: NodeModel[]): NodeModel[] {
    const nodeMap = new Map<number, NodeModel>();
    const rootNodes: NodeModel[] = [];

    // Build a map of nodes using their IDs
    nodes.forEach((node) => {
      node.children = []; // Initialize children as an empty array
      nodeMap.set(node.id, node);
    });

    // Link child nodes to parent nodes
    nodes.forEach((node) => {
      if (node.parentNodeId !== null) {
        const parentNode = nodeMap.get(node.parentNodeId);
        if (parentNode) {
          // Ensure parentNode.children is initialized before pushing
          parentNode.children = parentNode.children || [];
          parentNode.children.push(node);
        }
      } else {
        rootNodes.push(node); // If no parent, it's a root node
      }
    });

    return rootNodes;
  }

}
