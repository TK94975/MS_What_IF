import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import ScheduleContainer from '../ScheduleContainer';
import axios from "axios";
jest.mock("axios")

describe('ScheduleContainer Component', () => {
    beforeAll(() => {
        jest.spyOn(global.console, "log").mockImplementation(() => {}); // Suppress console.log
    });
    afterAll(() => {
        jest.restoreAllMocks(); // Restore original behavior
    });
    it("Renders default schedule with no courses when user is not signed in", async () => {
        const mockContextValue = {
            isUserSignedIn: false, // User is not signed in
            courses: [], // No courses
            setCourses: jest.fn(), // Mock function for updating courses
        };
        // Axios response for course options
        const mockResponse = {
            data: [
            { id: 1, department: "CSI", number: "500", title: "Advanced Algorithms" },
            { id: 2, department: "CSI", number: "501", title: "Machine Learning" },
            { id: 3, department: "ECE", number: "300", title: "Signal Processing" },
            ],
        };
        axios.get.mockResolvedValueOnce(mockResponse);

        // Axios response for default course description
        const mockPostResponse = {
            data: {
              department: "CSI",
              number: "500",
              title: "Operating Systems",
              description: "An in-depth study of OSs.",
            },
          };
          axios.post.mockResolvedValueOnce(mockPostResponse);


    await act(async () => {
        render(
          <UserContext.Provider value={mockContextValue}>
            <ScheduleContainer />
          </UserContext.Provider>
        );
      });
    
        // Check that the "Schedule" header is rendered
        expect(screen.getByText("Schedule")).toBeInTheDocument();
    
        // Check that Add Semester and Add Course buttons are displayed
        expect(screen.getByText("Add Semester")).toBeInTheDocument();
        expect(screen.getByText("Add Course")).toBeInTheDocument();

        // Check that the available course options are checked
        expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_SERVER_URL}/courses/course_options`);
        expect(axios.get).toHaveBeenCalledTimes(1);
      });

});
