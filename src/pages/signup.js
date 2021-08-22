import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

export default function Signup() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const isInvalid = emailAddress === '' || password === '';

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(username);

    if (!usernameExists.length) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        // authentication
        // -> email address & password & username (displayName)
        await createdUserResult.user.updateProfile({
          displayName: username
        });

        // firebase user collection (create a document)
        await firebase
          .firestore()
          .collection('users')
          .add({
            userId: createdUserResult.user.uid,
            username: username.toLowerCase(),
            fullName,
            following: ['4'],
            followers: [],
            emailAddress: emailAddress.toLowerCase(),
            dataCreated: Date.now()
          });

        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName('');
        setPassword('');
        setEmailAddress('');
        setErr(error.message);
      }
    } else {
      setPassword('');
      setErr('The username is already taken. Please try another!');
    }
  };
  useEffect(() => {
    document.title = 'Signup - Instagramme';
  }, []);
  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img src="/images/iphone-with-profile.jpg" alt="Iphone with Instagramme" />
      </div>
      <div className="flex flex-col w-2/5 items-center">
        <div className="flex flex-col bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagramme" className="mt-2 w-6/12" />
          </h1>
          {err && (
            <p className="mb-4 text-xs text-red-primary" data-testid="error">
              {err}
            </p>
          )}

          <form onSubmit={handleSignup} method="POST" data-testid="signup">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
            />
            <input
              aria-label="Enter your email address"
              type="email"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              value={emailAddress}
              onChange={({ target }) => setEmailAddress(target.value)}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
                isInvalid && `opacity-50`
              }`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium" data-testid="login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
