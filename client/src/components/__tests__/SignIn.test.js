import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../SignIn";
import { UserContext } from "../../context/userContext";
import axios from "axios";

// Mock axios and UserContext
jest.mock("axios");
const mockSetIsUserSignedIn = jest.fn();


describe("SignIn Component", () => {
    beforeAll(() => {
        jest.spyOn(global.console, "log").mockImplementation(() => {}); // Suppress console.log
    });
    afterAll(() => {
        jest.restoreAllMocks(); // Restore original behavior
    });

    const renderWithContext = () =>
        render(
        <UserContext.Provider value={{ setIsUserSignedIn: mockSetIsUserSignedIn }}>
            <SignIn />
        </UserContext.Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it("renders the Sign-In form", () => {
        renderWithContext();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Sign In")); // Open modal
        expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    });

    it("does not submit sign-in request if email and password are not filled out", async () => {
        const mockSetIsUserSignedIn = jest.fn();
    
        render(
          <UserContext.Provider value={{ setIsUserSignedIn: mockSetIsUserSignedIn }}>
            <SignIn />
          </UserContext.Provider>
        );
    
        // Open the modal
        fireEvent.click(screen.getByText("Sign In"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    
        // Attempt to submit with empty email and password fields
        const submitButton = screen.getByTestId("submit-signin");
        fireEvent.click(submitButton);
    
        // Assert that axios.post was not called
        expect(axios.post).not.toHaveBeenCalled();
    
        // Assert that warning text is not displayed yet
        expect(screen.queryByText("Error signing in")).not.toBeInTheDocument();
      });

      it("submits sign-in request if email and password are filled out", async () => {
        const mockSetIsUserSignedIn = jest.fn();
      
        render(
          <UserContext.Provider value={{ setIsUserSignedIn: mockSetIsUserSignedIn }}>
            <SignIn />
          </UserContext.Provider>
        );
      
        // Open the modal
        fireEvent.click(screen.getByText("Sign In", { selector: "button" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      
        // Fill in the email and password fields
        fireEvent.change(screen.getByPlaceholderText("Enter email"), {
          target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
          target: { value: "password123" },
        });
      
        // Mock Axios response
        axios.post.mockResolvedValueOnce({
          data: [
            {
              id: "1",
              email: "test@example.com",
              major: "CS",
              concentration: "AI",
            },
          ],
        });
      
        // Submit the form
        const submitButton = screen.getByTestId("submit-signin");
        fireEvent.click(submitButton);
      
        // Assert that axios.post was called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_SERVER_URL}/users/signin`, {
          email: "test@example.com",
          password: "password123",
        });
      
      });
});