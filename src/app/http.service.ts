import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookModel } from './book-model';
import { ElementModel } from './element-model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  APIURL = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get<any[]>(`${this.APIURL}/api/books`);
  }

  createNewBook(model: BookModel): Observable<any> {
    return this.http.post<any>(`${this.APIURL}/api/books`, model);
  }

  getBookElements(title: string): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/api/elements/book/name/${title}`);
  }

  createNewElement(model: ElementModel): Observable<any> {
    return this.http.post(`${this.APIURL}/api/elements`, model);
  }

  getBookIdByTitle(title: string): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/api/book/name/${title}`);
  }
}
