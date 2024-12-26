import { useState } from 'react';

import FormInput from '../../components/form-input/form-input.component';
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

import './sign-up-form.styles.scss';
import Button from '../../components/button/button.component';

const test = false;

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  // if (test) console.log(formFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async event => {
    event.preventDefault(); // we will handle all behaviour of the form
    const { displayName, email, password, confirmPassword } = formFields;

    if (test)
      console.log(
        'handleSubmit triggered',
        displayName,
        email,
        password,
        confirmPassword
      );
    // need to verify both passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // verify the user is authenticated
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      if (test) console.log('Response', user); // no display name shown

      // create a user document
      await createUserDocumentFromAuth(user, {
        displayName,
      });

      // clear the fields
      resetFormFields();
    } catch (error) {
      if (error.code === 'autn/email-already-in-use') {
        alert('That email address has been previously registered.');
      } else {
        console.log('user creation encountered an error', error);
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
        <h2>Don't have an account?</h2>
        <span>Sign up with your email and password</span>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Display Name"
            type="text"
            required
            onChange={handleChange}
            name="displayName"
            value={displayName}
          />

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

          <FormInput
            label="Confirm Password"
            type="password"
            required
            onChange={handleChange}
            name="confirmPassword"
            value={confirmPassword}
          />

          <Button type="submit">Sign Up</Button>
        </form>
      </div>
    </div>
  );
};
export default SignUpForm;
