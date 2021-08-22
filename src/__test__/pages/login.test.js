import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Login from '../../pages/login';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

describe('<Login />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with a form submission and logs the user in', async () => {
    const succeedToLogin = jest.fn(() => Promise.resolve('I am signed in!'));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succeedToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual('Login - Instagramme');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'phuocthanhqt113@gmail.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });

      fireEvent.submit(getByTestId('login'));

      expect(succeedToLogin).toHaveBeenCalled();
      expect(succeedToLogin).toHaveBeenCalledWith('phuocthanhqt113@gmail.com', '123456');

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('phuocthanhqt113@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('123456');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the login page with a form submission and fails to login the user', async () => {
    const failToLogin = jest.fn(() => Promise.reject(new Error('Cannot sign in!')));
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual('Login - Instagramme');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'phuocthanhqt113.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });

      fireEvent.submit(getByTestId('login'));

      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith('phuocthanhqt113.com', '123456');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});
