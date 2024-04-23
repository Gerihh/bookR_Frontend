import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookModel } from './book-model';

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
}
