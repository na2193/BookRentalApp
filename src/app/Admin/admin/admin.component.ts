import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Book } from './book';
import { BookService } from './book.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public books: Book[];
  public editBook: Book;
  public deleteBook: Book;
  public deleteBookName: string;
  public editBookName: string;

  addNewBookForm = this.formBuilder.group({
    bookName: ['', Validators.required],
    authorLastName: ['', Validators.required],
    authorFirstName: ['', Validators.required],
    isbn: ['', [Validators.required, Validators.maxLength(15)]],
    genre: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    numInStock: ['', [Validators.required, Validators.maxLength(2)]],
    imagePath: [''],
  });

  editBookForm = this.formBuilder.group({
    id: [''],
    bookName: ['', Validators.required],
    authorLastName: ['', Validators.required],
    authorFirstName: ['', Validators.required],
    isbn: ['', [Validators.required, Validators.maxLength(15)]],
    genre: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    numInStock: ['', [Validators.required, Validators.maxLength(2)]],
    imagePath: [''],
  });

  constructor(private bookService: BookService, private formBuilder: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {
    this.getBooks();
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
  }

  public getBooks(): void {
    this.bookService.getBooks()
      .subscribe((response: Book[]) => {
        this.books = response;
        console.log(this.books);
      },
      (err: HttpErrorResponse) => {
        alert(err.message);
      }
    );
  }

  public onAddBook(): void {
    this.bookService.addBook(this.addNewBookForm.value).subscribe(
      (response: Book) => {
        console.log(response);
        this.getBooks();
        this.addNewBookForm.reset();
        document.getElementById('add-book-form').click();
        
        this.toastr.success('Successfully Added New Book!', 'Add New Book')
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateBook(book: Book): void {
    this.bookService.updateBook(book).subscribe(
      (response: Book) => {
        console.log(response);
        this.getBooks();
        this.editBookForm.reset();
        document.getElementById('edit-book-form').click();

        this.toastr.success('Successfully Updated Book!', 'Edit Book')
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(
      (response: void) => {
        console.log(response);
        document.getElementById('delete-book-form').click();
        this.toastr.success('Successfully Deleted Book!', 'Delete Book')
        this.getBooks();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public resetForm(addForm: FormGroup): void {
      addForm.reset();
  }

  public searchBooks(key: string): void {
    console.log(key);
    const results: Book[] = [];
    for(const book of this.books) {
      if(book.bookName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.authorLastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.authorFirstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.isbn.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || book.genre.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(book);
      }
    }
    this.books = results;
    // if the user search is not found or they didn't enter anything, show everything
    if(results.length === 0 || !key) {
      this.getBooks();
    }
  }

  public onOpenModal(book: Book, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add') {
      button.setAttribute('data-target', '#addBookModal');
    }
    if(mode === 'edit') {
      this.editBook = book;
      console.log('Book selected for edit -> \n');
      console.log(this.editBook);
      this.editBookName = this.editBook.bookName;
      this.setValue();
      button.setAttribute('data-target', '#editBookModal');
    }
    if(mode === 'delete') {
      this.deleteBook = book;
      console.log(this.deleteBook);
      this.deleteBookName = this.deleteBook.bookName;
      button.setAttribute('data-target', '#deleteBookModal');
    }
    container.appendChild(button);
    button.click();
  }

  private setValue(): void {
    this.editBookForm.setValue({
      id: this.editBook.id,
      bookName: this.editBook.bookName,
      authorLastName: this.editBook.authorLastName,
      authorFirstName: this.editBook.authorFirstName,
      isbn: this.editBook.isbn,
      genre: this.editBook.genre,
      description: this.editBook.description,
      numInStock: this.editBook.numInStock,
      imagePath: this.editBook.imagePath
    });
  }

}

