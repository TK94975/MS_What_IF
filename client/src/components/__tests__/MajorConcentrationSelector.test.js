import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserContext } from '../../context/userContext';
import MajorConcentrationSelector from '../MajorConcentrationSelector';

describe('MajorConcentrationSelector Component', () => {
    it('Checks if default major and concentration are displayed', () => {
        render(
        <UserContext.Provider value={{ 
            selectedMajor: "CSI",
            handleMajorChange: jest.fn(),
            selectedConcentration: "Artificial Intelligence and Machine Learning",
            handleConcentrationChange : jest.fn(), }}>
            <MajorConcentrationSelector />
        </UserContext.Provider>
        );

        expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
        expect(screen.getByText(/Artificial Intelligence/)).toBeInTheDocument();
    });

    it('Checks if changing major works', () => {
        // Mock handle changeMajor function
        const handleMajorChange = jest.fn();
        render(
        <UserContext.Provider value={{ 
            selectedMajor: "CSI",
            handleMajorChange,
            selectedConcentration: "Artificial Intelligence and Machine Learning",
            handleConcentrationChange : jest.fn(), }}>
            <MajorConcentrationSelector />
        </UserContext.Provider>
        );
      // Find the major dropdown
    const majorDropdown = screen.getByLabelText(/Major/i);
    expect(majorDropdown).toBeInTheDocument();

    // Change the major to "ECE"
    fireEvent.change(majorDropdown, { target: { value: "ECE" } });

    // Assert that handleMajorChange was called with "ECE"
    expect(handleMajorChange).toHaveBeenCalledWith("ECE");
    expect(screen.getByText(/Electrical and Computer Engineering/)).toBeInTheDocument();
    });

    it('Checks if changing concentration works', () => {
        // Mock handle changeMajor function
        const handleConcentrationChange = jest.fn();
        render(
        <UserContext.Provider value={{ 
            selectedMajor: "CSI",
            handleMajorChange: jest.fn(),
            selectedConcentration: "Artificial Intelligence and Machine Learning",
            handleConcentrationChange, }}>
            <MajorConcentrationSelector />
        </UserContext.Provider>
        );
      // Find the major dropdown
    const concentrationDropdown = screen.getByLabelText(/Concentration/i);
    expect(concentrationDropdown).toBeInTheDocument();

    // Change the major to "ECE"
    fireEvent.change(concentrationDropdown, { target: { value: "Systems" } });

    // Assert that handleMajorChange was called with "ECE"
    expect(handleConcentrationChange).toHaveBeenCalledWith("Systems");
    expect(screen.getByText(/Computer Systems/)).toBeInTheDocument();
    });

});
