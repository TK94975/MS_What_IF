import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../SignIn";
import { UserContext } from "../context/userContext";
import axios from "axios";

// Mock axios and UserContext
jest.mock("axios");

const mockSetIsUserSignedIn = jest.fn();

describe("SignIn Component", () => {
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

  it("shows error for empty fields", async () => {
    renderWithContext();
    fireEvent.click(screen.getByText("Sign In")); // Open modal
    fireEvent.click(screen.getByText("Sign In")); // Submit without input
    expect(screen.getByText("Please provide your email")).toBeInTheDocument();
    expect(screen.getByText("Please provide your password")).toBeInTheDocument();
  });

  it("calls API and updates session on successful login", async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({
      data: [
        { id: 1, email: "test@example.com", major: "CS", concentration: "AI" },
      ],
    });

    renderWithContext();
    fireEvent.click(screen.getByText("Sign In")); // Open modal

    // Fill email and password
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In")); // Submit form

    await waitFor(() => {
      // Verify API call
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_SERVER_URL}/users/signin`,
        { email: "test@example.com", password: "password123" }
      );

      // Verify session storage updates
      expect(sessionStorage.getItem("userEmail")).toBe("test@example.com");
      expect(sessionStorage.getItem("userLoggedIn?")).toBe("true");

      // Verify context update
      expect(mockSetIsUserSignedIn).toHaveBeenCalledWith(true);
    });
  });

  it("displays error for invalid credentials", async () => {
    // Mock API rejection for invalid credentials
    axios.post.mockRejectedValueOnce({
      response: { status: 401, data: { error: "Invalid credentials" } },
    });

    renderWithContext();
    fireEvent.click(screen.getByText("Sign In")); // Open modal

    // Fill email and password
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Sign In")); // Submit form

    await waitFor(() => {
      // Verify error message
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("handles server errors gracefully", async () => {
    // Mock server error
    axios.post.mockRejectedValueOnce(new Error("Server error"));

    renderWithContext();
    fireEvent.click(screen.getByText("Sign In")); // Open modal

    // Fill email and password
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In")); // Submit form

    await waitFor(() => {
      expect(screen.getByText("Error signing in")).toBeInTheDocument();
    });
  });
});
