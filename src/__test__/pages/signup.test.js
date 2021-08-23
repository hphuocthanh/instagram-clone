import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Signup from '../../pages/signup';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';
import { doesUsernameExist } from '../../services/firebase';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../services/firebase');

describe('<Signup />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the signup page with a form submission and signs the user in', async () => {
    const addUserToCollection = jest.fn(() => ({
      add: jest.fn(() => Promise.resolve('User added'))
    }));
    const succeedToSignUp = jest.fn(() => ({
      user: { updateProfile: jest.fn(() => Promise.resolve('I am signed up!')) }
    }));
    const firebase = {
      firestore: jest.fn(() => ({
        collection: addUserToCollection
      })),
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: succeedToSignUp
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Signup />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve(true)); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), {
        target: { value: 'hphuocthanh' }
      });

      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Thanh Hoang Phuoc' }
      });

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'phuocthanhqt113@gmail.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });

      fireEvent.submit(getByTestId('signup'));

      expect(document.title).toEqual('Signup - Instagramme');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('hphuocthanh');

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('hphuocthanh');
        expect(getByPlaceholderText('Full name').value).toBe('Thanh Hoang Phuoc');
        expect(getByPlaceholderText('Email address').value).toBe('phuocthanhqt113@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('123456');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the signup page but username exists (an error is present)', async () => {
    const failToSignUp = jest.fn(() => ({
      user: { updateProfile: jest.fn(() => Promise.resolve({})) }
    }));
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: failToSignUp
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Signup />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve([false])); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), {
        target: { value: 'hphuocthanh' }
      });

      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Thanh Hoang Phuoc' }
      });

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'phuocthanhqt113@gmail.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });

      fireEvent.submit(getByTestId('signup'));

      expect(document.title).toEqual('Signup - Instagramme');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('hphuocthanh');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('hphuocthanh');
        expect(getByPlaceholderText('Full name').value).toBe('Thanh Hoang Phuoc');
        expect(getByPlaceholderText('Email address').value).toBe('phuocthanhqt113@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });

  it('renders the signup page but an error is thrown', async () => {
    const errorToSignUp = jest.fn(() => ({
      user: { updateProfile: jest.fn(() => Promise.reject(new Error('Username exists!'))) }
    }));
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: errorToSignUp
      }))
    };
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Signup />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve(false)); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), {
        target: { value: 'hphuocthanh' }
      });

      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Thanh Hoang Phuoc' }
      });

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'phuocthanhqt113@gmail.com' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '123456' }
      });

      fireEvent.submit(getByTestId('signup'));

      expect(document.title).toEqual('Signup - Instagramme');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('hphuocthanh');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('hphuocthanh');
        expect(getByPlaceholderText('Full name').value).toBe('');
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});
