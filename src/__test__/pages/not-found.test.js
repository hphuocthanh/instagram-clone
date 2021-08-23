import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import NotFound from '../../pages/notfound';
import { getUserByUserId } from '../../services/firebase';
import userFixture from '../../fixtures/logged-in-user';

jest.mock('../../services/firebase');

describe('<NotFound />', () => {
  it('renders the notfound page with a logged in user', async () => {
    await act(async () => {
      await getUserByUserId.mockImplementation(() => [userFixture]);

      const { getByText } = render(
        <Router>
          <FirebaseContext.Provider value={{}}>
            <UserContext.Provider value={{ user: {} }}>
              <NotFound />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(getByText('404 | Not Found!')).toBeTruthy();
        expect(document.title).toEqual('Not Found - Instagramme');
      });
    });
  });

  it('renders the notfound page with no active logged in user', async () => {
    await act(async () => {
      await getUserByUserId.mockImplementation(() => []);

      const { getByText } = render(
        <Router>
          <FirebaseContext.Provider value={{}}>
            <UserContext.Provider value={{ user: null }}>
              <NotFound />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(document.title).toEqual('Not Found - Instagramme');
        expect(getByText('404 | Not Found!')).toBeTruthy();
      });
    });
  });
});
