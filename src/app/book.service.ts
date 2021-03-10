import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Book } from './book';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiServerURL = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred on the Client Side:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
              `Backend returned code ${error.status}, ` +
              `Error message ${error.error.message}, ` +
              `Body was: ${error.error}`);
          }
          // Return an observable with a user-facing error message.
          window.alert('ERROR: ' + error.error.message);
          return throwError('Something bad happened; please try again later.');
    }

    public getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiServerURL}/api/book/all`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // NOT SAVING TO DATABASE AS THE FRONT END BEING PASSED IN ARE ALL NULLS  

    public addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(`${this.apiServerURL}/api/book/add`, book)
            .pipe(
                catchError(this.handleError)
            );
    }

    public updateBook(book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.apiServerURL}/api/book/update`, book)
            .pipe(
                catchError(this.handleError)
            );
    }

    public deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerURL}/api/book/delete/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }
}