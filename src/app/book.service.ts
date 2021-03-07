import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from './book';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiServerURL = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiServerURL}/api/book/all`);
    }

    public addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(`${this.apiServerURL}/api/book/add`, book);
    }

    public updateBook(book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.apiServerURL}/api/book/update`, book);
    }

    public deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerURL}/api/book/delete/${id}`);
    }
}