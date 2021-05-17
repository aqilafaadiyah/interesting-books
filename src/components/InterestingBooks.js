import React, { useState, useEffect } from 'react';
import img from '../images/img_11.png';
import { firebaseDb, auth, provider } from '../firebase/config'

function InterestingBooks() {

  const initialValues = {
    username: "",
    currentBook: "",
    bookAuthor: "",
    description: ""
  }

  const [book, setBook] = useState(initialValues);
  const [booksFromDb, setBooksFromDb] = useState([]);
  const [user, setUser] = useState(null);


  //retrieve data from database
  useEffect(() => {
    const booksRef = firebaseDb.ref('books');
    booksRef.on('value', (snapshot) => {
      console.log(snapshot.val());
      var dataSnapshot = snapshot.val();

      //temporal array to hold curated data from db
      var booksFromDb1 = [];

      //clean/convert the data from database into an array of dictionaries
      for (let key in dataSnapshot) {
        booksFromDb1.push({
          id: key,
          title: dataSnapshot[key].title,
          author: dataSnapshot[key].author,
          user: dataSnapshot[key].user,
          description: dataSnapshot[key].description
        });
      }
      console.log(booksFromDb1);

      setBooksFromDb(booksFromDb1)
    })
  }, [book, user]);


  //tracking inputs
  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    })
  }
  console.log(book);


  // submitting to database
  const handleSubmit = (e) => {
    e.preventDefault();

    const booksRef = firebaseDb.ref('books');

    var new_book = {
      title: book.currentBook,
      author: book.bookAuthor,
      user: user.displayName || user.email,
      description: book.description
    }
    booksRef.push(new_book);

    console.log('here');
    //reset input fields to empty
    setBook({
      currentBook: '',
      bookAuthor: '',
      username: '',
      description: ''
    });
  }

  console.log(booksFromDb);

  //remove book from UI
  const removeBook = (bookId) => {
    const booksRef = firebaseDb.ref(`books/${bookId}`);
    booksRef.remove();
  }

  // login 
  const login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      });
  }


  //log out
  const logout = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
      });
  }


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user])


  return (
    <div className='app'>
      <header>
        <div className='wrapper'>
          <section>
            <h1>Interesting Books</h1>
            <img src={img} alt="Books logo" width="50" height="50" />
          </section>
          {
            user ?
              <button onClick={logout}>Log Out</button>
              :
              <button onClick={login}>Log In</button>
          }

        </div>
      </header>

      {
        user ?
          <div>
            <div className='user-profile'>
              <img src={user.photoURL} alt="User images" />
            </div>

            <div className='container'>
              <section className="add-item">
                <form onSubmit={handleSubmit}>
                  <input type="text" name="username" placeholder="Your name?"
                    onChange={handleChange}
                    value={user.displayName || user.email}
                  />

                  <input type="text" name="currentBook" placeholder="Book recommendation?"
                    onChange={handleChange}
                    value={book.currentBook}
                  />

                  <input type="text" name="bookAuthor" placeholder="Book author?"
                    onChange={handleChange}
                    value={book.bookAuthor}
                  />

                  <textarea name="description" placeholder="Why should we read this?"
                    value={book.description}
                    onChange={handleChange} >
                  </textarea>

                  <button>Add Book</button>
                </form>
              </section>

              <section className='display-item'>
                <div className='wrapper'>
                  <ul>
                    {
                      booksFromDb.map((bookFromDb) => {
                        return (
                          <li key={bookFromDb.id}>
                            <h3>{bookFromDb.title}</h3>
                            <p>Author: {bookFromDb.author}</p>
                            <p>Suggested by: {bookFromDb.user}</p>
                            <p>Description: {bookFromDb.description}</p>
                            {
                              bookFromDb.user === user.displayName || bookFromDb.user === user.email
                                ?
                                <button onClick={() => removeBook(bookFromDb.id)}>
                                  Remove Book
                                </button>
                                :
                                null
                            }
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </section>
            </div>
          </div>

          :

          <div className='wrapper-1'>
            <p className="text-text">You need to be logged in with a google account
            to see the book list and submit your recommendation.
            </p>

            <section className='display-item'>
              <div className='wrapper'>
                <ul>
                  {
                    booksFromDb.map((bookFromDb) => {
                      return (
                        <li key={bookFromDb.id}>
                          <h3>{bookFromDb.title}</h3>
                          <p>Author: {bookFromDb.author}</p>
                          <p>Suggested by: {bookFromDb.user}</p>
                          <p>Description: {bookFromDb.description}</p>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </section>
          </div>
      }
    </div>

  );
}

export default InterestingBooks;
