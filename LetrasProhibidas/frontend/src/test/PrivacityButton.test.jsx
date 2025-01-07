import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrivacityButton } from '../components/assets/PrivacityButton';

describe('PrivacityButton Component', () => {
    test('renders with initial status text', () => {
        render(<PrivacityButton initialStatus={true} onChange={() => { }} />);
        expect(screen.getByText('Privado')).toBeInTheDocument();
    });

    test('renders with correct className based on initial status', () => {
        render(<PrivacityButton initialStatus={false} onChange={() => { }} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primaryBlue');
    });

    test('calls onChange handler with correct value when clicked', () => {
        const handleChange = jest.fn();
        render(<PrivacityButton initialStatus={true} onChange={handleChange} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(handleChange).toHaveBeenCalledWith(false);
    });

    test('toggles status text when clicked', () => {
        render(<PrivacityButton initialStatus={true} onChange={() => { }} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Público')).toBeInTheDocument();
    });

    test('toggles button className when clicked', () => {
        render(<PrivacityButton initialStatus={true} onChange={() => { }} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(button).toHaveClass('bg-primaryBlue');
    });
});