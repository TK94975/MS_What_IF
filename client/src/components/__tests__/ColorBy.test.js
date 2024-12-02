import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ColorBycore, ColorByconcentration } from "../ColorBy";

process.env.REACT_APP_SERVER_URL = 'http://localhost:5000'; // Mock server URL

const mock = new MockAdapter(axios);

afterEach(() => {
    mock.reset();
});

describe("ColorBycore", () => {
    it("displays 'Core Course' when the API returns isCore=true", async () => {
        // Mock API response for core course
        mock.onPost('http://localhost:5000/course_concentrations').reply(200, {
            concentration: 'Theoretical Computer Science',
        });

        render(
            <ColorBycore department="CSI" courseId="14" concentration="Theoretical Computer Science">
                Test Course
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText(/core course/i)).toBeInTheDocument();
        });
    });

    it("displays 'Elective' when the API returns isCore=false", async () => {
        mock.onPost('http://localhost:5000/course_concentrations').reply(200, {
            concentration: 'Systems',
        });

        render(
            <ColorBycore department="CIS" courseId="21" concentration="Theoretical Computer Science">
                Test Course
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText(/elective/i)).toBeInTheDocument();
        });
    });

    it("displays 'Consult Your Advisor' when the API call fails", async () => {
        // Simulate API failure
        mock.onPost('http://localhost:5000/course_concentrations').networkError();

        render(
            <ColorBycore department="CSI" courseId="TEST_fail_ID" concentration="AI">
                Test Course
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText(/consult your advisor/i)).toBeInTheDocument();
        });
    });

    it("renders multiple courses independently without overwriting state", async () => {
        // Mock API responses for both courses
        mock.onPost('http://localhost:5000/course_concentrations').reply(200, {
            concentration: "Core", // Mock concentration for both courses
        });

        render(
            <>
                <ColorBycore department="CSI" courseId="1" concentration="AI">
                    <div>CSI Course</div>
                </ColorBycore>
                <ColorBycore department="ECE" courseId="2" concentration="Systems">
                    <div>ECE Course</div>
                </ColorBycore>
            </>
        );

        // Wait for the first component to resolve
        await waitFor(() => {
            const csiElement = screen.getByText("CSI Course").parentElement;
            expect(csiElement).toHaveTextContent("Core Course");
        });

        // Wait for the second component to resolve
        await waitFor(() => {
            const eceElement = screen.getByText("ECE Course").parentElement;
            expect(eceElement).toHaveTextContent("Core Course");
        });

        // Ensure both courses retain their state independently
        expect(screen.getByText("CSI Course")).toBeInTheDocument();
        expect(screen.getByText("ECE Course")).toBeInTheDocument();
    });
});

describe("ColorByconcentration", () => {
    it("applies the correct color for a given concentration", () => {
        render(
            <ColorByconcentration concentration="Artificial Intelligence">
                AI Course
            </ColorByconcentration>
        );

        const element = screen.getByText(/ai course/i);
        expect(element).toHaveStyle("background-color: #ff5733");
    });

    it("applies the default color for an unknown concentration", () => {
        render(
            <ColorByconcentration concentration="Unknown Concentration">
                Unknown Course
            </ColorByconcentration>
        );

        const element = screen.getByText(/unknown course/i);
        expect(element).toHaveStyle("background-color: pink");
    });
});
