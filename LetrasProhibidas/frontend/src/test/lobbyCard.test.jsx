import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LobbyCard } from '../components/assets/lobbyCard';

describe('LobbyCard Component', () => {
    const defaultProps = {
        hostName: 'Oscar123',
        hostAvatar: 'avatar.jpg',
        playerCount: 3,
        maxPlayers: 5,
        onClick: jest.fn(),
    };

    test('renders with correct host name and avatar', () => {
        render(<LobbyCard {...defaultProps} />);
        expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'avatar.jpg');
    });

    test('renders with correct player count and max players', () => {
        render(<LobbyCard {...defaultProps} />);
        expect(screen.getByText('3/5')).toBeInTheDocument();
    });

    test('calls onClick handler when button is clicked', () => {
        render(<LobbyCard {...defaultProps} />);
        const button = screen.getByText('Unirse');
        fireEvent.click(button);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    test('renders player count with green text when not full', () => {
        render(<LobbyCard {...defaultProps} />);
        const playerCount = screen.getByText('3/5');
        expect(playerCount).toHaveClass('text-green-300');
    });

    test('renders player count with red text when full', () => {
        render(<LobbyCard {...defaultProps} playerCount={5} />);
        const playerCount = screen.getByText('5/5');
        expect(playerCount).toHaveClass('text-red-300');
    });

    test('renders with correct styles', () => {
        render(<LobbyCard {...defaultProps} />);
        const container = screen.getByRole('button').parentElement.parentElement;
        expect(container).toHaveClass('flex flex-row items-center justify-between w-full h-20 p-4 bg-secondaryBlue rounded-lg shadow-lg');
    });
});