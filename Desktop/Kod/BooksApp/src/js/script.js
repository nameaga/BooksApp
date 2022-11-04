/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    book: {
      image: '.books-list .book__image',
    }
  };
  const classNames = {
    favorite: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };


  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.initActions();
    }

    initData() {
      this.data = dataSource.books;
      const thisBooksList = this;

      for(let book of this.data){
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.books(book);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        const menuContainer = document.querySelector(select.containerOf.booksList);
        menuContainer.appendChild(generatedDOM);
      }
    }
    getElements() {
      const thisBooksList = this;
      thisBooksList.books = document.querySelectorAll(select.book.image);
      thisBooksList.form = document.querySelector(select.containerOf.filters);
    }
    initActions(){
      const thisBooksList = this;
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      for(let book of thisBooksList.books){
        book.addEventListener('dblclick', function(event){
          if(event.target.offsetParent.classList.contains('book__image')){
            event.preventDefault();
            const targetBook = book.getAttribute('data-id');

            if(!thisBooksList.favoriteBooks.includes(targetBook)){
              book.classList.add(classNames.favorite);
              thisBooksList.favoriteBooks.push(targetBook);

            } else {
              book.classList.remove(classNames.favorite);
              const index = thisBooksList.favoriteBooks.indexOf(targetBook);
              thisBooksList.favoriteBooks.splice(index, 1);
            }
          }
        });
        thisBooksList.form.addEventListener('click', function(event){
          if(event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == 'filter'){
            console.log(event.target.value);
            if(event.target.checked == true){
              thisBooksList.filters.push(event.target.value);
            } else {
              thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
            }
            console.log(thisBooksList.filters);
          }
          thisBooksList.filterBooks();
        });
      }
    }
    filterBooks(){
      const thisBooksList = this;
      for(let book of this.data){
        let shouldBeHidden = false;
        for(const filter of thisBooksList.filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');

        if(shouldBeHidden == true){
          bookImage.classList.add(classNames.hidden);
        } else {
          bookImage.classList.remove(classNames.hidden);
        }
      }
    }
    determineRatingBgc(rating) {
      const thisBooksList = this;
      thisBooksList.ratingBgc = '';

      if (rating < 6) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%';
      } else if (rating > 6 && rating <= 8) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%';
      } else if (rating > 8 && rating <= 9) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
      } else if (rating > 9) {
        thisBooksList.ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%';
      }

      return thisBooksList.ratingBgc;
    }

  }
  const app = new BooksList();
  console.log(app);
}