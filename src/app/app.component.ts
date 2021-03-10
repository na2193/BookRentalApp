import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Book } from './book';
import { BookService } from './book.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public books: Book[];
  public editBook: Book;

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
    bookName: ['', Validators.required],
    authorLastName: ['', Validators.required],
    authorFirstName: ['', Validators.required],
    isbn: ['', [Validators.required, Validators.maxLength(15)]],
    genre: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    numInStock: ['', [Validators.required, Validators.maxLength(2)]],
    imagePath: [''],
  });


  constructor(private bookService: BookService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getBooks();
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
    //document.getElementById('add-book-form').click(); - this was causing an issue so moved it inside the addBook, don't know why?
    this.bookService.addBook(this.addNewBookForm.value).subscribe(
      (response: Book) => {
        console.log(response);
        this.getBooks();
        this.addNewBookForm.reset();
        document.getElementById('add-book-form').click();
        // add a success popup message
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
        this.addNewBookForm.reset();
        //document.getElementById('add-book-form').click();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public resetForm(addForm: FormGroup): void {
      addForm.reset();
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
      this.setValue();
      button.setAttribute('data-target', '#editBookModal');
    }
    if(mode === 'delete') {
      button.setAttribute('data-target', '#deleteBookModal');
    }
    container.appendChild(button);
    button.click();
  }

  private setValue(): void {
    this.editBookForm.setValue({
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



  // trying to add white spaces so the ISBN can be centerd, don't know how to send that info over
  // public modifyGenreSpace(): void {
  //   this.bookService.getBooks()
  //   .subscribe((response: Book[]) => {
  //     var temp = response;
  //     for(let i = 0; i < temp.length; i++) {
  //       console.log(i + " -- " + temp[i].genre + " -- " + temp[i].genre.length);

  //       var maxLenght = 12;
  //       if(temp[i].genre.length < maxLenght) {
  //         var diff = 12 - temp[i].genre.length;
  //         console.log("Diff - " + diff);
  //         var newLength = temp[i].genre.length + diff;
  //         console.log("newLenght - " + newLength);
  //       }
  //     }
  //   })
  // }

}
