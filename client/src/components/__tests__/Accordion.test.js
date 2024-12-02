import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Accordion from "react-bootstrap/Accordion";
import { ColorBycore, ColorByconcentration } from "../ColorBy";

// Create a mock for Axios
const mock = new MockAdapter(axios);

const groupedCoursesMock = {
    2024: {
        Fall: [
            { id: "1", department: "CSI", number: "500", title: "Operating Systems (3)", completed: "no" },
            { id: "4", department: "CSI", number: "503", title: "Computer Networks (3)", completed: "yes" },
        ],
        Spring: [
            { id: "14", department: "CSI", number: "521", title: "Discrete Mathematics with Applications (3)", completed: "yes" },
        ],
    },
};

describe("Accordion Component Tests", () => {
    beforeEach(() => {
        mock.reset();
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: 'Theoretical Computer Science', // Mock concentration response
        });
    });

    it("renders the correct number of years and semesters", () => {
        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Validate year and semesters are displayed
        expect(screen.getByText(/year: 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/fall/i)).toBeInTheDocument();
        expect(screen.getByText(/spring/i)).toBeInTheDocument();
    });

    it("handles successful POST request and renders core/elective status correctly", async () => {
        // Mock POST response for course concentration
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Theoretical Computer Science", // Mock concentration response
        });

        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Validate core/elective status
        await waitFor(() => {
            expect(screen.getByText("Core Course")).toBeInTheDocument();
        });
    });

    it("handles successful GET request for available concentrations", async () => {
        // Mock GET response with available concentrations
        mock.onGet("http://localhost:5000/available_concentrations").reply(200, [
            "Artificial Intelligence and Machine Learning",
            "Theoretical Computer Science",
            "Signal Processing",
        ]);

        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Check if concentration choices are correctly rendered based on the mock GET response
        await waitFor(() => {
            expect(screen.getByText("Artificial Intelligence and Machine Learning")).toBeInTheDocument();
            expect(screen.getByText("Theoretical Computer Science")).toBeInTheDocument();
        });
    });

    it("displays fallback message on POST request failure", async () => {
        // Simulate API failure for POST request
        mock.onPost("http://localhost:5000/course_concentrations").networkError();

        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Validate fallback message is shown
        await waitFor(() => {
            expect(screen.getByText("Consult Your Advisor")).toBeInTheDocument();
        });
    });

    it("displays fallback message on GET request failure", async () => {
        // Simulate API failure for GET request
        mock.onGet("http://localhost:5000/available_concentrations").networkError();

        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Validate fallback message is shown when GET request fails
        await waitFor(() => {
            expect(screen.getByText("Consult Your Advisor")).toBeInTheDocument();
        });
    });

    it("displays correct course details for both a core course and elective course", async () => {
        // Simulate API response for core and elective
        // Mock API response with matching concentration
        mock.onPost("http://localhost:5000/course_concentrations").reply(200, {
            concentration: "Theoretical Computer Science",
        });

        render(
            <Accordion alwaysOpen>
                {Object.entries(groupedCoursesMock).map(([year, semesters], yearIndex) => (
                    <Accordion.Item eventKey={yearIndex} key={year}>
                        <Accordion.Header>{`Year: ${year}`}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(semesters).map(([semester, courses]) => (
                                <div key={semester}>
                                    <h5>{semester}</h5>
                                    <ul>
                                        {courses.map((course) => (
                                            <ColorBycore
                                                key={course.id}
                                                department={course.department}
                                                courseId={course.id}
                                                concentration="Theoretical Computer Science"
                                            >
                                                <p>Core Status</p>
                                                <ColorByconcentration
                                                    concentration="Artificial Intelligence and Machine Learning"
                                                >
                                                    {`${course.department} ${course.number} - ${course.title}`}
                                                </ColorByconcentration>
                                            </ColorBycore>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        );

        // Validate core/elective course status
        await waitFor(() => {
            expect(screen.getByText("Core Course")).toBeInTheDocument();
        });
    });
});



