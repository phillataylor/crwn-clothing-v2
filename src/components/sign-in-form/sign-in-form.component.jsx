import { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import {
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  authenticateUserWithEmailAndPassword,
} from '../../utils/firebase/firebase.utils';

import './sign-in-form.styles.scss';
import Button from '../button/button.component';

const test = false;

const defaultFormFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  // if (test) console.log(formFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    // user get's passed as userAuth in firebase.utils.jsx to create doc ref
    if (test) console.log('user: ', user);
    // await createUserDocumentFromAuth(user);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = formFields;

    if (test) console.log(`email: ${email}, password: ${password}`);

    if (!email || !password) {
      alert('Display name and/or password missing');
      return;
    }

    try {
      const { user } = await authenticateUserWithEmailAndPassword(
        email,
        password
      );

      if (test) console.log(user);

      // clear the fields
      resetFormFields();
    } catch (error) {
      const errorCode = error.code;
      // const errorMessage = error.message;
      switch (errorCode) {
        case 'auth/wrong-password':
          alert('Incorrect password for email.');
          break;
        case 'auth/user-not-found':
          alert('no users associated with this email');
          break;
        case 'auth/invalid-credential':
          alert('Invalid username or password');
          break;
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleChange = event => {
    //track field being updated
    const { name, value } = event.target;

    // we update only one item at a time. Spread the other items of the state
    // then update state of the targeted field.
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div>
      <div className="sign-up-container">
        <h2>Already have an account?</h2>
        <span>Sign-in with your email and password</span>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            required
            onChange={handleChange}
            name="email"
            value={email}
          />

          <FormInput
            label="Password"
            type="password"
            required
            onChange={handleChange}
            name="password"
            value={password}
          />
          <div className="buttons-container">
            <Button type="sign-in">Sign-in</Button>
            <Button
              type="button"
              buttonType="google"
              onClick={signInWithGoogle}
            >
              Google Sign-in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
