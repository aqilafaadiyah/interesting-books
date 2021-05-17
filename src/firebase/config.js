import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDM7hv9Grti2V0nvCHPg-_S45ErjHedoQM",
  authDomain: "interesting-books.firebaseapp.com",
  projectId: "interesting-books",
  storageBucket: "interesting-books.appspot.com",
  messagingSenderId: "461287448200",
  appId: "1:461287448200:web:74a640ea72d9a7e3ca893d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firebaseDb = firebase.database();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export { firebaseDb, auth, provider };