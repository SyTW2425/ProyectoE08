import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmButton } from '../components/assets/ConfirmButton';

describe('ConfirmButton', () => {
    test('renders with correct text', () => {
        render(<ConfirmButton text="Confirm" />);
        expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    test('applies the correct className', () => {
        render(<ConfirmButton text="Confirm" className="custom-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<ConfirmButton text="Confirm" onClick={handleClick} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders with correct type', () => {
        render(<ConfirmButton text="Confirm" type="submit" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });
});