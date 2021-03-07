import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Book } from './book';
import { BookService } from './book.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public books: Book[];

  constructor(private bookService: BookService) { }

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

  public onAddBook(addForm: NgForm): void {
    document.getElementById('add-book-form').click();
    this.bookService.addBook(addForm.value).subscribe(
      (response: Book) => {
        console.log(response);
        this.getBooks();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public resetForm(addForm: NgForm): void {
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
      button.setAttribute('data-target', '#editBookModal');
    }
    if(mode === 'delete') {
      button.setAttribute('data-target', '#deleteBookModal');
    }
    container.appendChild(button);
    button.click();
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
