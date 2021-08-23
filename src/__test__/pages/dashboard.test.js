import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Dashboard from '../../pages/dashboard';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import suggestedProfilesFixture from '../../fixtures/suggested-profiles';
import { getPhotos, getSuggestedProfiles } from '../../services/firebase';
import useUser from '../../hooks/use-user';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Dashboard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with a user profile and follows a user from the suggested profile sidebar', async () => {
    await act(async () => {
      getPhotos.mockImplementation(() => photosFixture);
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const firebase = {
        firestore: jest.fn(() => ({
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              update: jest.fn(() => Promise.resolve('User added'))
            }))
          }))
        }))
      };

      const fieldValues = {
        arrayUnion: jest.fn(),
        arrayRemove: jest.fn()
      };
      const { getByText, getByTitle, getByTestId, getAllByText, getByAltText } = render(
        <Router>
          <FirebaseContext.Provider value={{ firebase, FieldValue: fieldValues }}>
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <LoggedInUserContext.Provider value={{ user: userFixture }}>
                <Dashboard
                  user={{ uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' }}
                />
              </LoggedInUserContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(document.title).toEqual('Instagramme');
        expect(getByTitle('Logout')).toBeTruthy();
        expect(getAllByText('ldwook')).toBeTruthy();
        expect(getByAltText('Instagramme')).toBeTruthy(); // instagramme logo
        expect(getByAltText('hphuocthanh profile')).toBeTruthy();
        expect(getByText('Suggestions for you')).toBeTruthy();

        fireEvent.click(getByText('Follow'));

        // regular click
        fireEvent.click(getByTestId('like-photo-MhZxas95vww83DBO4Pci'));
        fireEvent.keyDown(getByTestId('like-photo-MhZxas95vww83DBO4Pci'), {
          key: 'Enter',
          code: 'Enter'
        }); // toggle like using keyboard

        // click to focus on the comment icon -> input box
        fireEvent.click(getByTestId('focus-input-MhZxas95vww83DBO4Pci'));

        // add a comment to a photo on the dashboard
        fireEvent.change(getByTestId('add-comment-MhZxas95vww83DBO4Pci'), {
          target: { value: 'Amazing photo!' }
        });

        // test for amazing photo!
        fireEvent.submit(getByTestId('add-comment-submit-MhZxas95vww83DBO4Pci'));

        // submit a comment or at least attempt with an invalid string length
        // add a comment to a photo on the dashboard
        fireEvent.change(getByTestId('add-comment-MhZxas95vww83DBO4Pci'), {
          target: { value: '' }
        });
        fireEvent.submit(getByTestId('add-comment-submit-MhZxas95vww83DBO4Pci'));

        // toggle focus
        fireEvent.keyDown(getByTestId('focus-input-MhZxas95vww83DBO4Pci'), {
          key: 'Enter',
          code: 'Enter'
        });
        fireEvent.submit(getByTestId('add-comment-submit-MhZxas95vww83DBO4Pci'));
      });
    });
  });

  it('renders the dashboard with a user profile of undefined', async () => {
    await act(async () => {
      getPhotos.mockImplementation(() => photosFixture);
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
      useUser.mockImplementation(() => ({ user: undefined }));

      const firebase = {
        firestore: jest.fn(() => ({
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              update: jest.fn(() => Promise.resolve({}))
            }))
          }))
        }))
      };

      const { getByText, queryByText } = render(
        <Router>
          <FirebaseContext.Provider value={{ firebase }}>
            <UserContext.Provider
              value={{ user: { uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' } }}
            >
              <LoggedInUserContext.Provider value={{ user: userFixture }}>
                <Dashboard
                  user={{ uid: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93', displayName: 'hphuocthanh' }}
                />
              </LoggedInUserContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
      expect(queryByText('Suggestions for you')).toBeFalsy();
    });
  });
});
