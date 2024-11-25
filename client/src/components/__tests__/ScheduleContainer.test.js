import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import ScheduleContainer from '../ScheduleContainer';
import axios from 'axios';


describe('ScheduleContainer Component', () => {
    it("Renders default schedule with no courses when user is not signed in", () => {
        jest.mock(axios);
        render(<ScheduleContainer isUserSignedIn={false} />);
    
        // Check that the "Schedule" header is rendered
        expect(screen.getByText("Schedule")).toBeInTheDocument();
    
        // Check that Add Semester and Add Course buttons are displayed
        expect(screen.getByText("Add Semester")).toBeInTheDocument();
        expect(screen.getByText("Add Course")).toBeInTheDocument();
        expect(screen.getByText("Save Changes")).not.toBeInTheDocument();
      });

});
