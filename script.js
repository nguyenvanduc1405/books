const $ = document.querySelector.bind(document);

const bookList = $("#book-list");
const bookForm = $("#book-form");
const bookTitle = $("#book-title");
const bookAuthor = $("#book-author");
const bookGenre = $("#book-genre");
const bookRating = $("#book-rating");
const bookFilter = $("#book-filter");
const deleteAllBooks = $("#delete-all-books");
const bookSearch = $("#book-search");

let books = JSON.parse(localStorage.getItem("books")) ?? [];

bookForm.onsubmit = function (e) {
   e.preventDefault();
   const bookTitleValue = bookTitle.value.trim();
   const bookAuthorValue = bookAuthor.value.trim();
   const bookGenreValue = bookGenre.value.trim();
   const bookRatingValue = +bookRating.value;

   if (
      !bookTitleValue ||
      !bookAuthorValue ||
      !bookGenreValue ||
      !bookRatingValue
   )
      return alert("All fields must be filled");
   if (isDuplicate(bookTitleValue))
      return alert("The title must not overlap with other titles");
   books.push({
      title: bookTitleValue,
      author: bookAuthorValue,
      fiction: bookGenreValue,
      rating: bookRatingValue,
      isFinite: false,
   });
   bookRating.value = "";
   saveBooks();
   renderBooks();
   bookForm.reset();
};

bookList.onclick = function (e) {
   const booksItem = e.target.closest(".book-item");
   if (!booksItem) return;
   const bookItemIndex = +booksItem?.dataset.index;
   const book = books[bookItemIndex];

   if (e.target.closest(".favorite")) {
      console.log(bookItemIndex);

      book.isFinite = !book.isFinite;
      renderBooks();
      saveBooks();
      return;
   }
   if (e.target.closest(".edit")) {
      bookTitle.value = book.title;
      bookAuthor.value = book.author;
      bookGenre.value = book.fiction;
      bookRating.value = book.rating;
      books.splice(bookItemIndex, 1);
      renderBooks();
      if (isDuplicate(bookTitle.value))
         return alert("The title must not overlap with other titles");
      saveBooks();
      return;
   }
   if (e.target.closest(".delete")) {
      if (confirm("You must definitely delete this book")) {
         books.splice(bookItemIndex, 1);
         renderBooks();
         saveBooks();
         return;
      }
   }
};

function isDuplicate(title) {
   return books.some(
      (book) => book.title.toLowerCase() === title.toLowerCase()
   );
}

function saveBooks() {
   localStorage.setItem("books", JSON.stringify(books));
}

deleteAllBooks.onclick = function () {
   if (!books.length) return;
   if (confirm("You will definitely delete all the books")) {
      books = [];
      renderBooks();
      saveBooks();
   }
};

bookSearch.oninput = function () {
   renderBooks();
};

bookFilter.onchange = function (e) {
   renderBooks();
};

function renderBooks() {
   if (!books.length) {
      bookList.innerHTML = `
        <li id="empty-message">No books available.</li>
    `;
      return;
   }
   const searchInput = bookSearch.value.trim().toLowerCase();
   const filterInput = bookFilter.value;
   const filterBooksType = books.filter((book) => {
      const isSearchBookValue =
         book.title.toLowerCase().includes(searchInput) ||
         book.author.toLowerCase().includes(searchInput);
      const filterValueType =
         filterInput === "fiction"
            ? book.fiction === "fiction"
            : filterInput === "non-fiction"
            ? book.fiction === "non-fiction"
            : true;
      return isSearchBookValue && filterValueType;
   });
   const html = filterBooksType
      .map(
         (book, index) => `
    <li class="book-item" data-index="${index}">
               <div class="book-info">
                  <p class="book-title">${book.title}</p>
                  <p class="book-author">Author: ${book.author}</p>
                  <p class="book-genre">${book.fiction}</p>
                  <p class="book-rating">Rating: ${book.rating}⭐</p>
                  <button title='yêu thích' class="action-btn favorite ${
                     book.isFinite ? "active" : ""
                  }">⭐</button>
               </div>
               <div class="book-actions">
                  <button class="action-btn edit">Edit</button>
                  <button class="action-btn delete">Delete</button>
               </div>
            </li>
`
      )
      .join(" ");
   bookList.innerHTML = html;
}
renderBooks();
