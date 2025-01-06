import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserCarousel } from '../components/assets/UserCarousel';

describe('UserCarousel Component', () => {
    const defaultProps = {
        players: [
            { userID: '1', userName: 'Player1', userAvatar: 'avatar1.jpg', lives: 3 },
            { userID: '2', userName: 'Player2', userAvatar: 'avatar2.jpg', lives: 0 },
        ],
        turn: '1',
        guessTries: [
            { userID: '1', word: 'guess1', isCorrect: true },
            { userID: '2', word: 'guess2', isCorrect: false },
        ],
    };

    beforeEach(() => {
        localStorage.setItem('userName', 'Player1');
    });

    test('renders player names and avatars', () => {
        render(<UserCarousel {...defaultProps} />);
        expect(screen.getByAltText('Player1')).toHaveAttribute('src', 'avatar1.jpg');
        expect(screen.getByAltText('Player2')).toHaveAttribute('src', 'avatar2.jpg');
        expect(screen.getByText('PLAYER1')).toBeInTheDocument();
        expect(screen.getByText('PLAYER2')).toBeInTheDocument();
    });

    test('applies correct border to the player whose turn it is', () => {
        render(<UserCarousel {...defaultProps} />);
        const player1 = screen.getByText('PLAYER1').parentElement.parentElement;
        expect(player1).toHaveClass('border-primaryBlue border-4');
    });

    test('renders guess tries with correct styles', () => {
        render(<UserCarousel {...defaultProps} />);
        const correctGuess = screen.getByText('guess1');
        expect(correctGuess).toHaveClass('border-green-400');
    });

    test('renders player avatar in grayscale when lives are 0', () => {
        render(<UserCarousel {...defaultProps} />);
        const player2Avatar = screen.getByAltText('Player2');
        expect(player2Avatar).toHaveClass('filter grayscale');
    });

    test('highlights the current user name', () => {
        render(<UserCarousel {...defaultProps} />);
        const player1Name = screen.getByAltText('Player1');
        expect(player1Name).toHaveClass('rounded-full border-white border-4 max-w-36 max-h-36');
    });
});