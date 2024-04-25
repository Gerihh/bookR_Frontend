import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { NodeModel } from '../node-model';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
})
export class NodeComponent implements OnInit {
  @Input() nodes: any[] = [];
  name: string = '';
  showDescription: boolean = false;
  selectedNode: any;
  children: any[] = [];
  showEditor: boolean = false;
  model: NodeModel = {
    name: '',
    description: '',
    elementId: 0,
    parentNodeId: null,
  };
  showConfirmation: boolean = false;
  showForm: boolean = false;
  currentElement: any;

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
        this.nodes = result;
        this.randomizeNodePositions();
      },
      error: (err: any) => console.log(err),
    });
  }

  randomizeNodePositions(): void {
    const maxX = window.innerWidth - 200; // Adjust width based on node size
    const maxY = window.innerHeight - 200; // Adjust height based on node size

    this.nodes.forEach((node) => {
      const { x, y } = this.getRandomPosition(maxX, maxY);
      node.positionX = x;
      node.positionY = y;
    });
  }

  getRandomPosition(maxX: number, maxY: number): { x: number; y: number } {
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    return { x, y };
  }

  startDrag(event: MouseEvent | TouchEvent, node: NodeModel): void {
    event.preventDefault();
    const initialX =
      typeof (event as TouchEvent).touches !== 'undefined'
        ? (event as TouchEvent).touches[0].clientX
        : (event as MouseEvent).clientX;
    const initialY =
      typeof (event as TouchEvent).touches !== 'undefined'
        ? (event as TouchEvent).touches[0].clientY
        : (event as MouseEvent).clientY;
    const offsetX =
      node.positionX !== undefined ? initialX - node.positionX : 0;
    const offsetY =
      node.positionY !== undefined ? initialY - node.positionY : 0;

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      moveEvent.preventDefault();
      const currentX =
        typeof (moveEvent as TouchEvent).touches !== 'undefined'
          ? (moveEvent as TouchEvent).touches[0].clientX
          : (moveEvent as MouseEvent).clientX;
      const currentY =
        typeof (moveEvent as TouchEvent).touches !== 'undefined'
          ? (moveEvent as TouchEvent).touches[0].clientY
          : (moveEvent as MouseEvent).clientY;
      if (node.positionX !== undefined && node.positionY !== undefined) {
        node.positionX = currentX - offsetX;
        node.positionY = currentY - offsetY;
      }
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchend', upHandler);
  }

  openDescription(nodeId: number) {
    this.children = [];

    // Combine requests using forkJoin
    forkJoin([
      this.httpService.getNodeById(nodeId),
      this.httpService.getChildrenNodes(nodeId).pipe(
        catchError((error) => {
          // If an error occurs (e.g., no children found), emit an empty array
          return of([]);
        })
      ),
    ]).subscribe({
      next: ([nodeResult, childrenResult]: [NodeModel, NodeModel[]]) => {
        this.selectedNode = nodeResult;
        this.model = nodeResult;
        this.children = childrenResult;

        // Ensure this.selectedNode is not null or undefined before assigning children
        if (this.selectedNode) {
          this.selectedNode.children = this.children;
        }

        this.showDescription = true;
        console.log(this.selectedNode);
        console.log(this.children.length);
      },
      error: (err: any) => console.log(err),
    });
  }

  closeDescription() {
    this.showDescription = false;
    this.selectedNode = null;
    this.children = [];
  }

  openEditor() {
    this.showDescription = false;
    this.showEditor = true;
  }

  submitNodeEdit(id: number) {
    this.httpService.updateNode(id, this.model).subscribe({
      next: (result: any) => {
        window.location.reload();
        alert('Sikeres szerkesztés');
      },
      error: (err: any) => console.log(err),
    });
  }

  switchEditorState() {
    this.showEditor = !this.showEditor;
  }

  switchFormState() {
    this.showForm = !this.showForm;
  }

  openConfirmation() {
    this.showDescription = false;
    this.showConfirmation = true;
  }

  cancelDeletion() {
    this.showConfirmation = false;
  }

  deleteNode(id: number) {
    this.httpService.deleteNode(id).subscribe({
      next: (result: any) => {
        alert(`${this.selectedNode.name} törölve`);
        window.location.reload();
      },
      error: (err: any) => console.log(err),
    });
  }

  submitNewNode() {
    this.httpService.getElementByName(this.name).subscribe({
      next: (result: any) => {
        this.currentElement = result;
        this.model.elementId = this.currentElement.id;

        this.httpService.createNewNode(this.model).subscribe({
          next: (result: any) => {
            window.location.reload();
            alert(`${this.model.name} created`);
          },
          error: (err: any) => console.log(err),
        });
      },
      error: (err: any) => console.log(err),
    });

    if (!this.model.name) {
      alert('Please enter a node name');
      return;
    }
    if (!this.model.description) {
      alert('Please enter a node description');
      return;
    }
  }
}
