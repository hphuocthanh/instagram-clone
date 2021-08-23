import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Profile from '../../pages/profile';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import profileFollowedByLoggedInUser from '../../fixtures/profile-followed-by-logged-in-user';
import profileNotFollowedByLoggedInUser from '../../fixtures/profile-not-followed-by-logged-in-user';
import {
  getUserByUsername,
  getUserPhotosByUserId,
  isUserFollowingProfile
} from '../../services/firebase';
import useUser from '../../hooks/use-user';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ username: 'chanh308' }),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the profile page with a user profile', async () => {
    await act(async () => {
      getUserByUsername.mockImplementation(() => [userFixture]);
      getUserPhotosByUserId.mockImplementation(() => photosFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const { getByText, getByTitle } = render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve({}))
                }))
              }
            }}
          >
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
        expect(getUserByUsername).toHaveBeenCalledWith('chanh308');
        expect(getByTitle('Logout')).toBeTruthy();
        expect(getByText('hphuocthanh')).toBeTruthy();
        expect(getByText('Thanh Hoang Phuoc')).toBeTruthy();

        screen.getByText((content, node) => {
          const hasText = (node) => node.textContent === '0 followers';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
          return nodeHasText && childrenDontHaveText;
        });

        screen.getByText((content, node) => {
          const hasText = (node) => node.textContent === '1 following';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
          return nodeHasText && childrenDontHaveText;
        });
      });

      // ok, go ahead and sign the user out
      fireEvent.click(getByTitle('Logout'));
      expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.LOGIN);
      fireEvent.keyDown(getByTitle('Logout'), {
        key: 'Enter',
        code: 'Enter'
      });
    });
  });

  it('renders the profile page with a user profile with 1 follower', async () => {
    await act(async () => {
      userFixture.followers = ['3'];
      getUserByUsername.mockImplementation(() => [userFixture]);
      getUserPhotosByUserId.mockImplementation(() => photosFixture);
      useUser.mockImplementation(() => ({ user: userFixture, followers: ['3'] }));

      const { getByText, getByTitle } = render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve({}))
                }))
              }
            }}
          >
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
        expect(getUserByUsername).toHaveBeenCalledWith('chanh308');
        expect(getByTitle('Logout')).toBeTruthy();
        expect(getByText('hphuocthanh')).toBeTruthy();
        expect(getByText('Thanh Hoang Phuoc')).toBeTruthy();
      });
    });
  });

  it('renders the profile page with a user profile and logged in and follows a user', async () => {
    await act(async () => {
      isUserFollowingProfile.mockImplementation(() => true);
      profileNotFollowedByLoggedInUser.followers = [];
      getUserByUsername.mockImplementation(() => [profileNotFollowedByLoggedInUser]);
      getUserPhotosByUserId.mockImplementation(() => photosFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const { getByText, getByTitle } = render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve({}))
                }))
              }
            }}
          >
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
        expect(getUserByUsername).toHaveBeenCalledWith('chanh308');
        expect(getByTitle('Logout')).toBeTruthy();
        expect(getByText('chanh308')).toBeTruthy();
        expect(getByText('Chau Anh')).toBeTruthy();
        fireEvent.keyDown(getByText('Follow'), {
          key: 'Enter',
          code: 'Enter'
        });
      });
    });
  });

  it('renders the profile page with a user profile and logged in and unfollows a user', async () => {
    await act(async () => {
      isUserFollowingProfile.mockImplementation(() => true);
      getUserByUsername.mockImplementation(() => [profileFollowedByLoggedInUser]);
      getUserPhotosByUserId.mockImplementation(() => false);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const { getByText, getByTitle } = render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve({}))
                }))
              }
            }}
          >
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
        expect(getUserByUsername).toHaveBeenCalledWith('chanh308');
        expect(getByTitle('Logout')).toBeTruthy();
        expect(getByText('chanh308')).toBeTruthy();
        expect(getByText('Chau Anh')).toBeTruthy();
        fireEvent.click(getByText('Unfollow'));
      });
    });
  });

  it('renders the profile page but user does not exist so redirect happens', async () => {
    await act(async () => {
      getUserByUsername.mockImplementation(() => []);
      getUserPhotosByUserId.mockImplementation(() => []);
      useUser.mockImplementation(null);

      render(
        <Router>
          <FirebaseContext.Provider value={{}}>
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.NOT_FOUND);
      });
    });
  });
});
