import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeView from './index';
import { codeToHtml } from 'shiki';

// Mock the shiki library
jest.mock('shiki', () => ({
    codeToHtml: jest.fn(),
}));

describe('CodeView', () => {
    const mockCode = '[{"id": 1, "name": "Test"}]';
    const highlightedHtml = `<pre class="shiki"><code>...</code></pre>`;

    beforeEach(() => {
        // Reset mocks before each test
        (codeToHtml as jest.Mock).mockClear();
    });

    it('should render the button and be visible by default', () => {
        render(<CodeView code={mockCode} />);
        expect(screen.getByRole('button', { name: /Fechar/i })).toBeInTheDocument();
        expect(screen.getByText(/Fechar/i)).toBeInTheDocument();
    });

    it('should call codeToHtml and display the highlighted code', async () => {
        (codeToHtml as jest.Mock).mockResolvedValue(highlightedHtml);

        render(<CodeView code={mockCode} />);

        // Wait for the useEffect to run and the state to update
        await waitFor(() => {
            expect(codeToHtml).toHaveBeenCalledWith(mockCode, {
                lang: "json",
                theme: "dracula"
            });
        });

        const codeContainer = screen.getByText('...'); // Assuming '...' is part of the rendered HTML
        expect(codeContainer).toBeInTheDocument();
    });

    it('should toggle visibility when the button is clicked', async () => {
        (codeToHtml as jest.Mock).mockResolvedValue(highlightedHtml);
        render(<CodeView code={mockCode} />);

        // Initially visible
        await waitFor(() => {
            expect(screen.getByText('...')).toBeInTheDocument();
        });

        // Click to hide
        const toggleButton = screen.getByRole('button', { name: /Fechar/i });
        fireEvent.click(toggleButton);

        // Now it should be hidden
        await waitFor(() => {
            expect(screen.queryByText('...')).not.toBeInTheDocument();
        });
        
        // Button text should change
        expect(screen.getByRole('button', { name: /Ver JSON comandos/i })).toBeInTheDocument();

        // Click to show again
        fireEvent.click(toggleButton);

        // Now it should be visible again
        await waitFor(() => {
            expect(screen.getByText('...')).toBeInTheDocument();
        });

        // Button text should revert
        expect(screen.getByRole('button', { name: /Fechar/i })).toBeInTheDocument();
    });

    it('should display an error message if codeToHtml fails', async () => {
        const error = new Error('Shiki error');
        (codeToHtml as jest.Mock).mockRejectedValue(error);

        render(<CodeView code={mockCode} />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao formatar JSON.')).toBeInTheDocument();
        });
    });

    it('should not call codeToHtml if code is empty', async () => {
        render(<CodeView code="" />);
        
        await waitFor(() => {
            expect(codeToHtml).not.toHaveBeenCalled();
        });
    });

    it('should not call codeToHtml if code is "[]"', async () => {
        render(<CodeView code="[]" />);
        
        await waitFor(() => {
            expect(codeToHtml).not.toHaveBeenCalled();
        });
    });
});
