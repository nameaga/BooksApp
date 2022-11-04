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
  function renderBooks(){
    for(let book of dataSource.books){
      const generatedHTML = templates.books(book);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.booksList);
      menuContainer.appendChild(generatedDOM);
    }
  }


  const favoriteBooks = [];

  console.log('favoriteBooks', favoriteBooks);

  const filters = [];

  function filterBooks(){
    for(let book of dataSource.books){
      let shouldBeHidden = false;
      for(const filter of filters){
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

  function initActions(){

    const books = document.querySelectorAll(select.book.image);
    const form = document.querySelector(select.containerOf.filters);


    for(let book of books){
      book.addEventListener('dblclick', function(event){
        if(event.target.offsetParent.classList.contains('book__image')){
          event.preventDefault();
          const targetBook = book.getAttribute('data-id');
          console.log(book, favoriteBooks);

          if(!favoriteBooks.includes(targetBook)){
            book.classList.add(classNames.favorite);
            favoriteBooks.push(targetBook);

          } else {
            book.classList.remove(classNames.favorite);
            const index = favoriteBooks.indexOf(targetBook);
            favoriteBooks.splice(index, 1);
          }
        }
      });
      form.addEventListener('click', function(event){
        if(event.target.tagName == 'INPUT' && event.target.type == 'checkbox' && event.target.name == 'filter'){
          console.log(event.target.value);
          if(event.target.checked == true){
            filters.push(event.target.value);
          } else {
            filters.splice(filters.indexOf(event.target.value), 1);
          }
          console.log(filters);
        }
        filterBooks();
      });
    }
  }
  renderBooks();
  initActions();
}