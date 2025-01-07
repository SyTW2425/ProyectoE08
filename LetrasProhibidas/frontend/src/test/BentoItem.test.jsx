import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BentoItem } from '../components/assets/BentoItem';

describe('BentoItem Component', () => {
    const defaultProps = {
        title: 'Sample Title',
        description: 'Sample Description',
        background: 'sample.jpg',
        onClick: jest.fn(),
    };

    test('renders with correct title and description', () => {
        render(<BentoItem {...defaultProps} />);
        expect(screen.getByText('Sample Title')).toBeInTheDocument();
        expect(screen.getByText('Sample Description')).toBeInTheDocument();
    });

    test('calls onClick handler when clicked', () => {
        render(<BentoItem {...defaultProps} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    test('hides loading spinner after image loads', () => {
        render(<BentoItem {...defaultProps} />);
        const img = screen.getByAltText('Sample Title');
        fireEvent.load(img);
        const spinner = screen.queryByRole('status');
        expect(spinner).not.toBeInTheDocument();
    });

    test('hides loading spinner if image fails to load', () => {
        render(<BentoItem {...defaultProps} />);
        const img = screen.getByAltText('Sample Title');
        fireEvent.error(img);
        const spinner = screen.queryByRole('status');
        expect(spinner).not.toBeInTheDocument();
    });

    test('applies correct background image', () => {
        render(<BentoItem {...defaultProps} />);
        const img = screen.getByAltText('Sample Title');
        expect(img).toHaveAttribute('src', 'sample.jpg');
    });
});