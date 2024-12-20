// this brings down the suite of firebase tools
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc, // getting the document data
  setDoc, // setting the document data
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCubWS4ccAUeX2sYA8jnZtgEiHu62ehvEE',
  authDomain: 'crwn-clothing-db-86508.firebaseapp.com',
  projectId: 'crwn-clothing-db-86508',
  storageBucket: 'crwn-clothing-db-86508.firebasestorage.app',
  messagingSenderId: '756410204576',
  appId: '1:756410204576:web:ba9a9ce7370400c91c24c5',
};

const test = true;

// Initialize Firebase
const firerbaseApp = initializeApp(firebaseConfig);

// To use google authentication, initialize a provider using this class
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// points to the database in our console
export const db = getFirestore();

export const createUserDocumentFromAuth = async userAuth => {
  // see if there is an existing document reference for the user
  const userDocRef = doc(db, 'users', userAuth.uid);

  if (test) console.log('Document Reference: ', userDocRef);

  // get a uersSnapshot
  const userSnapshot = await getDoc(userDocRef);

  if (test) {
    console.log('userSnapshot: ', userSnapshot);
    console.log('Does userSnapshot exist? ', userSnapshot.exists());
  }

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
  // if user data does not exist
  // create / set the document with the data from userAuth in my collection

  // if user data exists
  // return userDocRef
};
