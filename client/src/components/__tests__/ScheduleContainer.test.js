import React from 'react';
import { render, screen, act, waitFor, fireEvent, endsWith } from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import ScheduleContainer from '../ScheduleContainer';
import axios from "axios";
jest.mock("axios")

describe('ScheduleContainer Component', () => {
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

    it("fetches user courses when logged in", async () => {
        mockSetCourses = jest.fn();
        const mockContextValue = {
            isUserSignedIn: true, // User is not signed in
            courses: [], // No courses
            setCourses: mockSetCourses, // Mock function for updating courses
        };

        // Mock Axios response for fetching user courses
        const mockCourses = [
            {
            id: 1,
            year: 2024,
            semester: "Fall",
            department: "CSI",
            number: "500",
            title: "Advanced Algorithms",
            grade: "A",
            },
            {
            id: 2,
            year: 2023,
            semester: "Spring",
            department: "ECE",
            number: "302",
            title: "Embedded Systems",
            grade: "B",
            },
        ];
        axios.post.mockResolvedValueOnce({
            data: { user_courses: mockCourses }, // Match the expected structure
        });

        // Axios response for course options
        const mockResponse = {
            data: [
            { id: 1, department: "CSI", number: "500", title: "Operating Systems" },
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
        
        // Wait for state updates and validate
        await waitFor(() => {
            expect(mockSetCourses).toHaveBeenCalledWith(mockCourses);
        });
    });

    it("add semester functionality", async () => {
        const mockSetCourses = jest.fn()
        const mockContextValue = {
            isUserSignedIn: false, // User is not signed in
            courses: [], // No courses
            setCourses: mockSetCourses, // Mock function for updating courses
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

        // Find and click the "Add Semester" button to open the modal
        const addSemesterButton = screen.getByText("Add Semester");
        fireEvent.click(addSemesterButton);

        // Wait for the modal to render and find the dropdown
        const yearDropdown = await screen.findByLabelText("New Year");
        expect(yearDropdown).toBeInTheDocument();

        // Change the year to 2025
        await act(async () => {
            fireEvent.change(yearDropdown, { target: { value: '2025' } });
        });

        // Wait for state update
        await waitFor(() => {
            expect(yearDropdown.value).toBe("2025");
        });

        const semesterDropdown = await screen.findByLabelText("New Semester");
        expect(semesterDropdown).toBeInTheDocument();

        // Change the semester to Spring
        fireEvent.change(semesterDropdown, { target: { value: "Spring" } });

        // Wait for state update
        await waitFor(() => {
            expect(semesterDropdown.value).toBe("Spring");
        });

        // Submit
        const submitButton = screen.getByTestId("submit-addsemester");
        fireEvent.click(submitButton);

        expect(mockSetCourses).toHaveBeenCalledTimes(2);
    });

    it("add course functionality", async () => {
        const mockSetCourses = jest.fn()
        const mockContextValue = {
            isUserSignedIn: false, // User is not signed in
            courses: [], // No courses
            setCourses: mockSetCourses, // Mock function for updating courses
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
        axios.post.mockImplementation((url) => {
            console.log("axios.post called with URL:", url);
            if (url && url.endsWith("/courses/course_description")) {
                return Promise.resolve({
                    data: {
                        department: "CSI",
                        number: "500",
                        title: "Operating Systems",
                        description: "An in-depth study of OSs.",
                    },
                });
            }
            return Promise.reject(new Error(`Unexpected axios.post call to ${url}`));
        });

        await act(async () => {
            render(
                <UserContext.Provider value={mockContextValue}>
                    <ScheduleContainer />
                </UserContext.Provider>
            );
        });

        // Find and click the "Add Course" button to open the modal
        const addCourseButton = screen.getByText("Add Course");
        await act(async () => {
            fireEvent.click(addCourseButton);
        });

         //Wait for the modal to render and find the dropdown
        const yearDropdown = await screen.findByLabelText("Select Year");
        expect(yearDropdown).toBeInTheDocument();

        // Change the year to 2025
        await act(async () => {
            fireEvent.change(yearDropdown, { target: { value: '2025' } });
        });

        // Wait for state update
        await waitFor(() => {
            expect(yearDropdown.value).toBe("2025");
        });

        const semesterDropdown = await screen.findByLabelText("Select Semester");
        expect(semesterDropdown).toBeInTheDocument();

        // Change the semester to Spring
        fireEvent.change(semesterDropdown, { target: { value: "Spring" } });

        // Wait for state update
        await waitFor(() => {
            expect(semesterDropdown.value).toBe("Spring");
        });

        // Select Department
        const departmentDropdown = screen.getByLabelText("Department");
        await act(async () => {
            fireEvent.change(departmentDropdown, { target: { value: "CSI" } });
        });
        expect(departmentDropdown.value).toBe("CSI");

        // Select Course
        const courseDropdown = screen.getByLabelText("Number");
        await act(async () => {
            fireEvent.change(courseDropdown, { target: { value: "500" } });
        });
        expect(courseDropdown.value).toBe("500");

        // Submit the course addition
        //const submitButton = screen.getByTestId("submit-addcourse")
        //fireEvent.click(submitButton);

        // Assert `setCourses` is called with the new course
        //await waitFor(() => {
        //    expect(mockSetCourses).toHaveBeenCalledWith(
        //        expect.arrayContaining([
        //            expect.objectContaining({
        //                id: 1,
        //                year: "2025",
        //                semester: "Spring",
        //                department: "CSI",
        //                number: "500",
        //                title: "Operating Systems",
        //            }),
        //        ])
        //    );
        //});
    });

    

    it("test dependency checking", async () => {
        const mockSetCourses = jest.fn()
        const mockContextValue = {
            isUserSignedIn: false, // User is not signed in
            courses: [], // No courses
            setCourses: mockSetCourses, // Mock function for updating courses
        };
        // Axios response for course options
        const mockResponse = {
            data: [
            { id: 14, department: "CSI", number: "503", title: "Advanced Algorithms" },
            ],
        };
        axios.get.mockResolvedValueOnce(mockResponse);
        // Axios response for course options
        const mockDependencies = {
            data: [
            { id: 1, department: "CSI", number: "500", title: "OS" },
            { id: 2, department: "CSI", number: "501", title: "Intro to breakfast" },
            ],
        };
        axios.get.mockResolvedValueOnce(mockDependencies);

        // Axios response for default course description
        axios.post.mockImplementation((url) => {
            console.log("axios.post called with URL:", url);
            if (url && url.endsWith("/courses/course_description")) {
                return Promise.resolve({
                    data: {
                        department: "CSI",
                        number: "503",
                        title: "Advanced Algorithms",
                        description: "P vs NP",
                    },
                });
            }
            return Promise.reject(new Error(`Unexpected axios.post call to ${url}`));
        });

        // Axios response for default course description
        axios.get.mockImplementation((url) => {
            console.log("axios.post called with URL:", url);
            if (url && url.endsWith("/course_prerequisites/14")) {
                //cp.prereq_course_id, c.department, c.number, c.title, cp.grade
                return Promise.resolve(mockDependencies);
            }
            return Promise.reject(new Error(`Unexpected axios.post call to ${url}`));
        });

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await act(async () => {
            render(
                <UserContext.Provider value={mockContextValue}>
                    <ScheduleContainer />
                </UserContext.Provider>
            );
        });

        // Find and click the "Add Course" button to open the modal
        const addCourseButton = screen.getByText("Add Course");
        await act(async () => {
            fireEvent.click(addCourseButton);
        });

         //Wait for the modal to render and find the dropdown
        const yearDropdown = await screen.findByLabelText("Select Year");
        expect(yearDropdown).toBeInTheDocument();

        // Change the year to 2025
        await act(async () => {
            fireEvent.change(yearDropdown, { target: { value: '2025' } });
        });

        // Wait for state update
        await waitFor(() => {
            expect(yearDropdown.value).toBe("2025");
        });

        const semesterDropdown = await screen.findByLabelText("Select Semester");
        expect(semesterDropdown).toBeInTheDocument();

        // Change the semester to Spring
        fireEvent.change(semesterDropdown, { target: { value: "Spring" } });

        // Wait for state update
        await waitFor(() => {
            expect(semesterDropdown.value).toBe("Spring");
        });

        // Select Department
        const departmentDropdown = screen.getByLabelText("Department");
        await act(async () => {
            fireEvent.change(departmentDropdown, { target: { value: "CSI" } });
        });
        expect(departmentDropdown.value).toBe("CSI");

        // Select Course
        const courseDropdown = screen.getByLabelText("Number");
        await act(async () => {
            fireEvent.change(courseDropdown, { target: { value: "503" } });
        });
        expect(courseDropdown.value).toBe("503");

        // Submit the course addition
        const submitButton = screen.getByTestId("submit-addcourse")
        await act(async () => {
            fireEvent.click(submitButton);
        })
        
        expect(alertMock).toHaveBeenCalledTimes(1)
    });

    it("test dependency checking course removal", async () => {
        const mockSetCourses = jest.fn()
        const mockContextValue = {
            isUserSignedIn: false, // User is not signed in
            courses: [{ id: 1, department: "CSI", number: "521", title: "Discrete Math", semester:'Fall', year: 2022, grade:'A'},
                { id: 14, department: "CSI", number: "503", title: "Algorithms", semester:'Fall', year: 2023, grade:'A'}
            ], // No courses
            setCourses: mockSetCourses, // Mock function for updating courses
        };
        // Axios response for course options
        const mockResponse = {
            data: [
            { id: 14, department: "CSI", number: "503", title: "Advanced Algorithms" },
            ],
        };
        axios.get.mockResolvedValueOnce(mockResponse);
        // Axios response for course options
        const mockDependencies = {
            data: [
            { id: 1, department: "CSI", number: "521", title: "Discrete Math" },
            ],
        };
        axios.get.mockResolvedValueOnce(mockDependencies);

        // Axios response for default course description
        axios.post.mockImplementation((url) => {
            console.log("axios.post called with URL:", url);
            if (url && url.endsWith("/courses/course_description")) {
                return Promise.resolve({
                    data: {
                        department: "CSI",
                        number: "503",
                        title: "Advanced Algorithms",
                        description: "P vs NP",
                    },
                });
            }
            return Promise.reject(new Error(`Unexpected axios.post call to ${url}`));
        });

        // Axios response for default course description
        axios.get.mockImplementation((url) => {
            console.log("axios.post called with URL:", url);
            if (url && url.endsWith("/course_prerequisites/inverse/14")) {
                //cp.prereq_course_id, c.department, c.number, c.title, cp.grade
                return Promise.resolve(mockDependencies);
            }
            return Promise.reject(new Error(`Unexpected axios.post call to ${url}`));
        });

        // Mock the alert function
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await act(async () => {
            render(
                <UserContext.Provider value={mockContextValue}>
                    <ScheduleContainer />
                </UserContext.Provider>
            );
        });

        // Click remove course to get modal
        const submitButton = screen.getAllByTestId("btn-removeCourse")[0]
        await act(async () => {
            fireEvent.click(submitButton);
        })

        // Click remove course final
        const removeCourseFinalButtons = screen.getByTestId("btn-finalRemoveCourse")
        await act(async () => {
            fireEvent.click(removeCourseFinalButtons);
        })
        
        expect(alertMock).toHaveBeenCalledTimes(1)
    });

});
