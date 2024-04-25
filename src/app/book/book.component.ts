import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { BookModel } from '../book-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  books: any[] = [];
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  model: BookModel = {
    title: '',
  };
  showForm: boolean = false;
  showEditor: boolean = false;
  title: string = '';
  currentBook: any;
  showConfirmation: boolean = false;

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.httpService.getBooks().subscribe({
      next: (result: any) => (this.books = result),
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

  submitNewBook() {
    if (!this.model.title) {
      alert('Please enter a book title');
      return;
    } else {
      this.httpService.createNewBook(this.model).subscribe({
        next: (result: any) => {
          window.location.reload();
          alert(`${this.model.title} created`);
        },
        error: (err: any) => console.log(err),
      });
    }
  }

  switchState() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.model.title = '';
    }
  }

  clickedBook(title: string) {
    this.router.navigate(['/', title, 'elements']);;
  }

  openEditor(title: string) {
    this.showEditor = true;
    this.httpService.getBookByTitle(title).subscribe({
      next: (result: any) => {
        this.currentBook = result
        this.model.title = this.currentBook.title},
      error: (err: any) => console.log(err)
    });
  }

  closeEditor() {
    this.showEditor = false;
    console.log(this.title);
  }

  submitBookEdit(id: number) {
    this.httpService.updateBook(id, this.model).subscribe({
      next: (result: any) => {
        window.location.reload();
        alert('Sikeres szerkesztés');
      },
      error: (err: any) => console.log(err),
    });
  }

  openConfirmation(name: string) {
    this.showConfirmation = true;
    this.httpService.getBookByTitle(name).subscribe({
      next: (result: any) => (this.currentBook = result),
      error: (err: any) => console.log(err)
    });
  }
  cancelDeletion() {
    this.showConfirmation = false;
    this.currentBook = null;
  }

  deleteBook(id: number) {
    this.httpService.deleteBook(id).subscribe({
      next: (result: any) => {
        alert(`${this.currentBook.title} törölve`);
        window.location.reload();
      },
      error: (err: any) => console.log(err),
    });
  }
}
