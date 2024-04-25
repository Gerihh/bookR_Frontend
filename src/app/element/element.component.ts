import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementModel } from '../element-model';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrl: './element.component.css',
})
export class ElementComponent implements OnInit {
  elements: any[] = [];
  title: string = '';
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  showForm: boolean = false;
  model: ElementModel = {
    name: '',
    nodeCount: 0,
    bookId: 0,
  };
  bookId: number = 0;
  currentElement: any;
  showEditor: boolean = false;
  showConfirmation: boolean = false;

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.title = params['title'];
    });

    this.httpService.getBookElements(this.title).subscribe({
      next: (result: any) => (this.elements = result),
      error: (err: any) => console.log(err),
    });

    this.httpService.getBookByTitle(this.title).subscribe({
      next: (result: any) => {
        this.bookId = result.id;
      },
      error: (err: any) => console.log(err),
    });
  }

  startDrag(event: MouseEvent): void {
    const container = document.querySelector('.card-container') as HTMLElement; // Type assertion
    if (!container) return; // Null check
    this.isDragging = true;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  drag(event: MouseEvent): void {
    if (!this.isDragging) return;
    const container = document.querySelector('.card-container') as HTMLElement; // Type assertion
    if (!container) return; // Null check
    const x: number = event.pageX - container.offsetLeft;
    const walk: number = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(): void {
    this.isDragging = false;
  }

  switchState() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.model.name = '';
    }
  }

  submitNewElement() {
    this.model.bookId = this.bookId;
    if (!this.model.name) {
      alert('Please enter an element name');
      return;
    }
    this.httpService.createNewElement(this.model).subscribe({
      next: (result: any) => {
        window.location.reload();
        alert(`${this.model.name} created`);
      },
      error: (err: any) => console.log(err),
    });
  }

  clickedElement(name: string) {
    this.router.navigate(['/', this.title, name, 'nodes']);
  }

  openEditor(name: string) {
    this.showEditor = true;
    this.httpService.getElementByName(name).subscribe({
      next: (result: any) => {
        this.currentElement = result
        this.model = this.currentElement},

      error: (err: any) =>console.log(err)
    });
  }

  closeEditor() {
    this.showEditor = false;
    this.model.name = '';
  }

  submitElementEdit(id: number) {
    this.httpService.updateElement(id, this.model).subscribe({
      next: (result: any) => {
        window.location.reload();
        alert('Sikeres szerkesztés');
      },
      error: (err: any) => console.log(err),
    });
  }

  deleteElement(id: number) {
    this.httpService.deleteElement(id).subscribe({
      next: (result: any) => {
        alert(`${this.currentElement.name} törölve`);
        window.location.reload();
      },
      error: (err: any) => console.log(err),
    });
  }

  openConfirmation(name: string) {
    this.showConfirmation = true;
    this.httpService.getElementByName(name).subscribe({
      next: (result: any) => (this.currentElement = result),
      error: (err: any) => console.log(err)
    });
  }

  cancelDeletion() {
    this.showConfirmation = false;
    this.currentElement = null;
  }
}
