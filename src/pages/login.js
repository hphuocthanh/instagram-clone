import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RoughNotation } from 'react-rough-notation';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';

export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const isInvalid = emailAddress === '' || password === '';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress('');
      setPassword('');
      setErr(error.message);
    }
  };

  useEffect(() => {
    document.title = 'Login - Instagramme';
  }, []);
  return (
    <div className="container flex flex-col lg:flex-row mx-auto max-w-screen-md items-center h-screen px-4 lg:px-0">
      <div className="hidden lg:flex w-full lg:w-3/5">
        <img src="/images/iphone-with-profile.jpg" alt="Iphone with Instagramme" />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 justify-center h-full max-w-md m-auto">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagramme" className="mt-2 mb-4" />
          </h1>
          {err && (
            <p data-testid="error" className="mb-4 text-xs text-red-primary">
              {err}
            </p>
          )}

          <form onSubmit={handleLogin} method="POST" data-testid="login">
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
              Login
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            <span>
              <RoughNotation type="underline" show animationDelay={1000} color="#005c98">
                Don't have an account?
              </RoughNotation>
            </span>{' '}
            <Link to={ROUTES.SIGNUP} className="font-bold text-blue-medium" data-testid="signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
