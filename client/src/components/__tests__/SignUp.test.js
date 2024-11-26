import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import axios from "axios";
import SignUp from "../SignUp";
import { UserContext } from "../../context/userContext";

jest.mock("axios");

describe("SignUp Component", () => {
    it("renders the Sign-Up form after clicking link", () => {
        render(
            <UserContext.Provider value={{}}>
            <SignUp />
            </UserContext.Provider>
        );
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Sign Up")); // Open modal
        expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Re-enter password")).toBeInTheDocument();
    });

    it("does not submit sign-up request if required fields are not filled out", async () => {
        render(
          <UserContext.Provider value={{ 
            setIsUserSignedIn: jest.fn(),
            selectedMajor: "CSI",
            handleMajorChange: jest.fn(),
            selectedConcentration: "Artificial Intelligence and Machine Learning",
            handleConcentrationChange: jest.fn(),
             }}>
            <SignUp />
          </UserContext.Provider>
        );
    
        // Open the modal
        fireEvent.click(screen.getByText("Sign Up"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    
        // Attempt to submit with empty email and password fields
        const submitButton = screen.getByTestId("submit-signup");
        fireEvent.click(submitButton);
    
        // Assert that axios.post was not called
        expect(axios.post).not.toHaveBeenCalled();
    
        // Assert that warning text is not displayed yet
        expect(screen.queryByText("Error creating account.")).not.toBeInTheDocument();
      });
});