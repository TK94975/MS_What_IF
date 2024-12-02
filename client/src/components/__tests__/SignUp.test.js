import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import axios from "axios";
import SignUp from "../SignUp";
import { UserContext } from "../../context/UserContext";

// Mock Axios
jest.mock("axios");

describe("SignUp Component", () => {
    let mockContext;

    beforeEach(() => {
        mockContext = {
            setIsUserSignedIn: jest.fn(),
            selectedMajor: "CSI",
            handleMajorChange: jest.fn(),
            selectedConcentration: "Artificial Intelligence",
            handleConcentrationChange: jest.fn(),
        };

        // Reset axios mock
        axios.post.mockReset();
    });

    it("renders the SignUp button", () => {
        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );
        // Query for the Sign Up button within the modal
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("opens the modal with the correct fields when Sign Up button is clicked", () => {
        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );

        // Trigger the modal opening by clicking the Sign Up button
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        // Wait for the modal to open and verify the specific fields inside it
        expect(screen.getByLabelText("Email address")).toBeInTheDocument(); // Email input field
        expect(screen.getByLabelText("Password")).toBeInTheDocument(); // Password input field
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument(); // Confirm password input field
    });

    it("validates password match", async () => {
        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );

        // Open the modal by clicking the Sign Up button
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        // Fill in the password and confirm password fields
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "password132" },
        });

        // Find the modal and the Sign Up button inside the modal
        const modal = screen.getByRole("dialog");
        const signUpButton = within(modal).getByRole("button", { name: /sign up/i });

        // Click the Sign Up button
        fireEvent.click(signUpButton);

        // Wait for the <p class="text-danger"> element to appear
        await waitFor(() => {
            const errorElement = modal.querySelector(".text-danger");
            expect(errorElement).toBeInTheDocument();
        });
    });


    it("sends data to the server on successful form submission", async () => {
        axios.post.mockResolvedValueOnce({
            status: 201,
            data: [
                {
                    id: "user123",
                    email: "test@example.com",
                    major: "CSI",
                    concentration: "Artificial Intelligence",
                },
            ],
        });

        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        fireEvent.change(screen.getByLabelText("Email address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "password123" },
        });

        // Use within to target the button inside the modal
        const modal = screen.getByRole("dialog");
        const signUpButton = within(modal).getByRole("button", { name: /sign up/i });

        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_SERVER_URL}/users/signup`,
                expect.objectContaining({
                    email: "test@example.com",
                    password: "password123",
                    major: "CSI",
                    concentration: "Artificial Intelligence",
                })
            );
        });

        expect(mockContext.setIsUserSignedIn).toHaveBeenCalledWith(true);
    });

    it("handles duplicate user registration error", async () => {
        axios.post.mockRejectedValueOnce({
            response: { status: 409 },
        });

        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        fireEvent.change(screen.getByLabelText("Email address"), {
            target: { value: "duplicate@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "password123" },
        });

        // Use within to target the button inside the modal
        const modal = screen.getByRole("dialog");
        const signUpButton = within(modal).getByRole("button", { name: /sign up/i });

        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByText("User already exists.")).toBeInTheDocument();
        });
    });

    it("handles general error on registration", async () => {
        axios.post.mockRejectedValueOnce(new Error("Server Error"));

        render(
            <UserContext.Provider value={mockContext}>
                <SignUp />
            </UserContext.Provider>
        );
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        fireEvent.change(screen.getByLabelText("Email address"), {
            target: { value: "error@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "password123" },
        });

        // Use within to target the button inside the modal
        const modal = screen.getByRole("dialog");
        const signUpButton = within(modal).getByRole("button", { name: /sign up/i });

        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByText("Error creating account.")).toBeInTheDocument();
        });
    });
});
