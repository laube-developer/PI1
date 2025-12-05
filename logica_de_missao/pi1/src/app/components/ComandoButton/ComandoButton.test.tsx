import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComandoButton from './index';
import { FaAngleRight } from 'react-icons/fa'; // Example icon

describe('ComandoButton', () => {
    it('should render children correctly', () => {
        render(<ComandoButton>Click Me</ComandoButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should call handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<ComandoButton handleClick={handleClick}>Test Button</ComandoButton>);
        fireEvent.click(screen.getByText('Test Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call handleClick when disabled', () => {
        const handleClick = jest.fn();
        render(<ComandoButton handleClick={handleClick} disabled>Disabled Button</ComandoButton>);
        const button = screen.getByText('Disabled Button');
        expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply custom className (string)', () => {
        render(<ComandoButton className="custom-class">Classy Button</ComandoButton>);
        expect(screen.getByText('Classy Button')).toHaveClass('custom-class');
    });

    it('should apply custom className (function)', () => {
        const getClassName = () => "dynamic-class";
        render(<ComandoButton className={getClassName}>Dynamic Class Button</ComandoButton>);
        expect(screen.getByText('Dynamic Class Button')).toHaveClass('dynamic-class');
    });

    it('should render icon on the left by default', () => {
        render(<ComandoButton icon={FaAngleRight}>Button with Icon</ComandoButton>);
        const button = screen.getByRole('button');
        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(button.firstChild).toContainElement(icon);
    });

    it('should render icon on the right when iconPos is "right"', () => {
        render(<ComandoButton icon={FaAngleRight} iconPos="right">Button with Icon</ComandoButton>);
        const button = screen.getByRole('button');
        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(button.lastChild).toContainElement(icon);
    });

    it('should not render an icon if icon prop is not provided', () => {
        render(<ComandoButton>Button without Icon</ComandoButton>);
        expect(screen.getByRole('button').querySelector('svg')).not.toBeInTheDocument();
    });

    it('should apply default primary color classes when no color is specified', () => {
        render(<ComandoButton>Default Color</ComandoButton>);
        const button = screen.getByText('Default Color');
        expect(button).toHaveClass('bg-slate-400');
    });

    it('should apply secondary color classes when color is "secondary"', () => {
        render(<ComandoButton color="secondary">Secondary Button</ComandoButton>);
        const button = screen.getByText('Secondary Button');
        expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });
});
