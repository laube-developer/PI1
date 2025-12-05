import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './index';
import { FaBeer } from 'react-icons/fa'; // Example icon

describe('Button', () => {
    it('should render children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should call handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button handleClick={handleClick}>Test Button</Button>);
        fireEvent.click(screen.getByText('Test Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call handleClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Button handleClick={handleClick} disabled>Disabled Button</Button>);
        fireEvent.click(screen.getByText('Disabled Button'));
        expect(handleClick).not.toHaveBeenCalled();
        expect(screen.getByText('Disabled Button')).toBeDisabled();
    });

    it('should apply custom className (string)', () => {
        render(<Button className="custom-class">Classy Button</Button>);
        expect(screen.getByText('Classy Button')).toHaveClass('custom-class');
    });

    it('should apply custom className (function)', () => {
        const getClassName = () => "dynamic-class";
        render(<Button className={getClassName}>Dynamic Class Button</Button>);
        expect(screen.getByText('Dynamic Class Button')).toHaveClass('dynamic-class');
    });

    it('should render icon on the left by default', () => {
        render(<Button icon={FaBeer}>Button with Icon</Button>);
        const button = screen.getByRole('button');
        const icon = screen.getByTestId('button-icon'); // Now we can reliably get the icon

        const buttonChildren = Array.from(button.childNodes);

        const iconIndex = buttonChildren.indexOf(icon);
        const textNodeIndex = buttonChildren.findIndex(node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Button with Icon'));

        expect(iconIndex).toBeGreaterThan(-1);
        expect(textNodeIndex).toBeGreaterThan(-1);
        expect(iconIndex).toBeLessThan(textNodeIndex); // Icon should be before text
    });

    it('should render icon on the right when iconPos is "right"', () => {
        render(<Button icon={FaBeer} iconPos="right">Button with Icon</Button>);
        const button = screen.getByRole('button');
        const icon = screen.getByTestId('button-icon');

        const buttonChildren = Array.from(button.childNodes);

        const iconIndex = buttonChildren.indexOf(icon);
        const textNodeIndex = buttonChildren.findIndex(node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Button with Icon'));

        expect(iconIndex).toBeGreaterThan(-1);
        expect(textNodeIndex).toBeGreaterThan(-1);
        expect(iconIndex).toBeGreaterThan(textNodeIndex); // Icon should be after text
    });

    it('should not render an icon if icon prop is not provided', () => {
        render(<Button>Button without Icon</Button>);
        expect(screen.getByRole('button').querySelector('svg')).not.toBeInTheDocument();
    });

    it('should have base classes applied', () => {
        render(<Button>Styled Button</Button>);
        const button = screen.getByText('Styled Button');
        expect(button).toHaveClass('w-full', 'bg-gray-200', 'text-gray-900', 'py-2', 'rounded-lg', 'text-xs', 'flex', 'items-center', 'justify-center', 'gap-1');
    });

    // Test for different color classes implicitly by checking default classes or presence of differentiating classes.
    // For now, we'll ensure basic functionality, specific class testing can be brittle with Tailwind.
    it('should apply default primary color classes when no color is specified', () => {
        render(<Button>Default Color</Button>);
        const button = screen.getByText('Default Color');
        // Check for a class that indicates the default primary color, e.g., 'bg-slate-400'
        expect(button).toHaveClass('bg-slate-400');
    });

    it('should apply success color classes when color is "success"', () => {
        render(<Button color="success">Success Button</Button>);
        const button = screen.getByText('Success Button');
        expect(button).toHaveClass('bg-green-500');
    });

    it('should apply smooth classes when smoth is true', () => {
        render(<Button smoth color="primary">Smooth Button</Button>);
        const button = screen.getByText('Smooth Button');
        expect(button).toHaveClass('bg-slate-200'); // SMOTH_COLOR_CLASSES.primary
        expect(button).not.toHaveClass('bg-slate-400'); // Not the regular primary
    });
});