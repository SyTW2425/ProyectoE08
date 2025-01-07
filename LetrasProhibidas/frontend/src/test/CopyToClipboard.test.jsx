import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CopyToClipboard } from '../components/assets/CopyToClipboard';

describe('CopyToClipboard Component', () => {
    test('renders with initial button text', () => {
        render(<CopyToClipboard toCopy="Sample text" />);
        expect(screen.getByText('Copiar código')).toBeInTheDocument();
    });


    test('calls navigator.clipboard.writeText with correct text', async () => {
        const writeTextMock = jest.fn();
        navigator.clipboard = { writeText: writeTextMock };
        render(<CopyToClipboard toCopy="Sample text" />);
        const button = screen.getByText('Copiar código');
        fireEvent.click(button);
        expect(writeTextMock).toHaveBeenCalledWith('Sample text');
    });
});