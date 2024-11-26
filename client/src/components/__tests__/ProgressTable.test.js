import React from 'react';
import { render, act, screen, waitFor} from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import ProgressTable from '../ProgressTable';
import axios from 'axios';

jest.mock('axios');


describe('ProfileBox Component', () => {
    const mockConcentrationRequirementsCSINew = {
        core: 7,
        concentration: 6,
        elective: 15,
        project: 3,
    };

    const mockUserProgressCSINew = {
        core: { completed_credits: 0, gpa: 0 },
        concentration: { completed_credits: 0, gpa: 0 },
        electives: { completed_credits: 0, gpa: 0 },
        project: { completed_credits: 0, gpa: 0 },
        thesisProject: { completed_credits: 0, gpa: 0 },
    };

    const mockUserProgressProjectedCSINew= {
        depth: { completed_credits: 0, gpa: 0 },
        breadth: { completed_credits: 0, gpa: 0},
        mathPhysics: { completed_credits: 0, gpa: 0 },
        technicalElective: { completed_credits: 0, gpa: 0 },
        thesisProject: { completed_credits: 0, gpa: 0 },
    };

    const mockConcentrationRequirementsECE = {
        depth: 6,
        breadth: 12,
        mathPhysics: 3,
        technicalElective: 3,
        thesis: 6,
    };

    const mockUserProgressECE = {
        depth: { completed_credits: 3, gpa: 3.2 },
        breadth: { completed_credits: 8, gpa: 3.0 },
        mathPhysics: { completed_credits: 2, gpa: 2.8 },
        technicalElective: { completed_credits: 0, gpa: 0 },
        thesisProject: { completed_credits: 3, gpa: 3.5 },
    };

    const mockUserProgressProjectedECE = {
        depth: { completed_credits: 6, gpa: 3.3 },
        breadth: { completed_credits: 13, gpa: 3.1 },
        mathPhysics: { completed_credits: 3, gpa: 3.0 },
        technicalElective: { completed_credits: 3, gpa: 3.0 },
        thesisProject: { completed_credits: 6, gpa: 3.6 },
    };

    beforeEach(() => {
        axios.post.mockReset();
    });

    it('fetches correct default requirements CSI AI', async () => {
        axios.post
            .mockResolvedValueOnce({ data: mockConcentrationRequirementsCSINew }) // Concentration requirements
            .mockResolvedValueOnce({ data: mockUserProgressCSINew }) // Current progress
            .mockResolvedValueOnce({ data: mockUserProgressProjectedCSINew }); // Projected progress

        await act(async () => {
            render(
                <UserContext.Provider 
                    value={{        
                        isUserSignedIn: false,
                        selectedConcentration: 'Artificial Intelligence and Machine Learning',
                        courses: [],
                    }}
                >
                    <ProgressTable />
                </UserContext.Provider>
            );
        });
        // Letting data load
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(5);
        });

        // Check that the concentration requirements table renders correctly
        expect(screen.getByText('Core')).toBeInTheDocument();
        expect(screen.getByText('7 credits')).toBeInTheDocument();
        expect(screen.getByText('Concentration')).toBeInTheDocument();
        expect(screen.getByText('6 credits')).toBeInTheDocument();
        expect(screen.getByText('Elective')).toBeInTheDocument();
        expect(screen.getByText('15 credits')).toBeInTheDocument();
        expect(screen.getByText('Project')).toBeInTheDocument();
        expect(screen.getByText('3 credits')).toBeInTheDocument();
    });

    it('fetches concentration requirements and user progress on load for ECE', async () => {
        axios.post
            .mockResolvedValueOnce({ data: mockConcentrationRequirementsECE }) // Concentration requirements
            .mockResolvedValueOnce({ data: mockUserProgressECE }) // Current progress
            .mockResolvedValueOnce({ data: mockUserProgressProjectedECE }); // Projected progress

        await act(async () => {
            render(
                <UserContext.Provider 
                value={{        
                    isUserSignedIn: false,
                    selectedConcentration: 'Signal Processing and Communications',
                    courses: [],
                }}
                >
                    <ProgressTable />
                </UserContext.Provider>
            );
        });

        // Letting data load
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(5);
        });

        // Right row labels for ECE?
        expect(screen.getByText('Depth')).toBeInTheDocument(); // Unique to ECE
        // Right user progress?
        expect(screen.getByText('8 credits')).toBeInTheDocument(); // unique to user progress
        // Right user projected progress?
        expect(screen.getByText('12 credits')).toBeInTheDocument(); // unique to user projected

    });


});
