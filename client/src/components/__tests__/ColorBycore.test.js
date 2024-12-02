import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { render, screen, waitFor } from "@testing-library/react";
import { ColorBycore } from "../ColorBy";

process.env.REACT_APP_SERVER_URL = "http://localhost:5000"; // Mock server URL

const mock = new MockAdapter(axios);

describe("ColorBycore Component", () => {
    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('renders "Core Course" when the returned concentration matches the provided concentration', async () => {
        // Mock API response with matching concentration
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Theoretical Computer Science",
        });

        render(
            <ColorBycore department="CSI" courseId="14" concentration="Theoretical Computer Science">
                Test
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText("Core Course")).toBeInTheDocument();
        });

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it('renders "Elective" when the returned concentration does not match the provided concentration', async () => {
        // Mock API response with a different concentration
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Theoretical Computer Science",
        });

        render(
            <ColorBycore department="CSI" courseId="14" concentration="Systems">
                Test
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText("Elective")).toBeInTheDocument();
        });

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it('renders "Core Course" if the API explicitly returns "Core" regardless of provided concentration', async () => {
        // Mock API response explicitly marking the course as Core
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Core",
        });

        render(
            <ColorBycore department="CSI" courseId="14" concentration="Theoretical Computer Science">
                Test
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText("Core Course")).toBeInTheDocument();
        });

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it('renders multiple courses independently for both elective and core without overwriting each other state', async () => {
        // Mock API responses for both courses
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Artificial Intelligence and Machine Learning", // Mock concentration for both courses
        });

        render(
            <>
                <ColorBycore department="CSI" courseId="21" concentration="Artificial Intelligence and Machine Learning">
                    <div>CSI Course 1</div>
                </ColorBycore>
                <ColorBycore department="CSI" courseId="20" concentration="Systems">
                    <div>CSI Course 2</div>
                </ColorBycore>
                <ColorBycore department="ECE" courseId="2" concentration="Systems">
                    <div>ECE Course</div>
                </ColorBycore>
            </>
        );

        // Wait for the CSI course to resolve (first component)
        await waitFor(() => {
            const csiElement = screen.getByText("CSI Course 1").parentElement;
            expect(csiElement).toHaveTextContent("Core Course"); // Update to expected text
        });

        // Wait for the second CSI course to resolve (second component)
        await waitFor(() => {
            const secondCsiElement = screen.getByText("CSI Course 2").parentElement;
            expect(secondCsiElement).toHaveTextContent("Elective"); // Update to expected text
        });

        // Wait for the ECE course to resolve (third component)
        await waitFor(() => {
            const eceElement = screen.getByText("ECE Course").parentElement;
            expect(eceElement).toHaveTextContent("Elective"); // Update to expected text
        });

        // Ensure both courses retain their state independently (verify text content)
        const csiCourse1 = screen.getByText("CSI Course 1");
        const csiCourse2 = screen.getByText("CSI Course 2");
        const eceCourse = screen.getByText("ECE Course");

        expect(csiCourse1).toBeInTheDocument();
        expect(csiCourse2).toBeInTheDocument();
        expect(eceCourse).toBeInTheDocument();
    });

    it('renders "Consult Your Advisor" when API call fails', async () => {
        // Simulate API failure
        mock.onPost("http://localhost:5000/course_concentrations").networkError();

        render(
            <ColorBycore department="CSI" courseId="3" concentration="Artificial Intelligence">
                Test
            </ColorBycore>
        );

        await waitFor(() => {
            expect(screen.getByText("Consult Your Advisor")).toBeInTheDocument();
        });

        expect(screen.getByText("Test")).toBeInTheDocument();
    });
});
