import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import ProfileBox from '../ProfileBox';

describe('ProfileBox Component', () => {
  beforeEach(() => {
    jest.spyOn(global.console, "log").mockImplementation(() => {}); // Suppress console.log
    // Mock sessionStorage for each test
    jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockImplementation((key) => {
      const storage = {
        userEmail: 'test@test.com',
        userID: '123',
        userMajor: 'CS',
        userConcentration: 'AI',
        'userLoggedIn?': 'true',
      };
      return storage[key];
    });

    jest.spyOn(window.sessionStorage.__proto__, 'removeItem').mockImplementation(() => {});
    jest.spyOn(window.sessionStorage.__proto__, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    // Cleans up mock sessionStorage
    jest.clearAllMocks();
  });

  it('renders ProfileBox with user email', () => {
    render(
      <UserContext.Provider value={{ setIsUserSignedIn: jest.fn() }}>
        <ProfileBox />
      </UserContext.Provider>
    );

    /*
    Test one: Checking if the user email is pulled from session storage
    and displayed in the box
     */
    expect(screen.getByText(/Email: test@test.com/)).toBeInTheDocument();
  });

  it('handles sign out correctly', () => {
    const setIsUserSignedIn = jest.fn(); // Allows jest to see if function was called

    render(
      <UserContext.Provider value={{ setIsUserSignedIn }}>
        <ProfileBox />
      </UserContext.Provider>
    );

    // Click the "Sign out" button
    fireEvent.click(screen.getByText(/Sign out/i));

    // Verify sessionStorage methods were called
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userID');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userEmail');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userMajor');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('userConcentration');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userLoggedIn?', 'false');

    // Verify context method is called
    expect(setIsUserSignedIn).toHaveBeenCalledWith(false);
  });
});
