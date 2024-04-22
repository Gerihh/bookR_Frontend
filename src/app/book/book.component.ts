import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {

  books: any[] = [];
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  constructor (
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.httpService.getBooks().subscribe({
      next: (result: any) => this.books = result,
      error: (err: any) => console.log(err)
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
}
