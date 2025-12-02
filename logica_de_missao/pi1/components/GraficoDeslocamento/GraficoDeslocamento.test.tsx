import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GraficoDeslocamento from './index';

// Mock the recharts library
jest.mock('recharts', () => {
    const OriginalRecharts = jest.requireActual('recharts');
    return {
        ...OriginalRecharts,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="responsive-container" style={{ width: 500, height: 500 }}>
                {children}
            </div>
        ),
        ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid="scatter-chart">{children}</div>,
        Scatter: ({ name, data }: { name: string, data: any[] }) => (
            <div data-testid={`scatter-${name.toLowerCase()}`} data-points={JSON.stringify(data)}>
                {name}
            </div>
        ),
        XAxis: () => <div data-testid="x-axis">XAxis</div>,
        YAxis: () => <div data-testid="y-axis">YAxis</div>,
        CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
        Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
        Legend: () => <div data-testid="legend">Legend</div>,
        ReferenceDot: ({ x, y }: { x: number, y: number }) => <div data-testid="reference-dot" data-x={x} data-y={y}>ReferenceDot</div>,
    };
});

describe('GraficoDeslocamento', () => {
    const mockDeslocamentoComandado = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
    const mockDeslocamentoReal = [{ x: 1.1, y: 2.2 }, { x: 3.3, y: 4.4 }];

    it('should render all chart components', () => {
        render(<GraficoDeslocamento deslocamentoComandado={[]} deslocamentoReal={[]} />);
        
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should pass the correct data to the Scatter components', () => {
        render(<GraficoDeslocamento 
            deslocamentoComandado={mockDeslocamentoComandado} 
            deslocamentoReal={mockDeslocamentoReal} 
        />);

        const comandadoScatter = screen.getByTestId('scatter-comandado');
        const realScatter = screen.getByTestId('scatter-real');

        expect(comandadoScatter).toBeInTheDocument();
        expect(realScatter).toBeInTheDocument();
        
        expect(comandadoScatter).toHaveAttribute('data-points', JSON.stringify(mockDeslocamentoComandado));
        expect(realScatter).toHaveAttribute('data-points', JSON.stringify(mockDeslocamentoReal));
    });

    it('should render the ReferenceDot at (0, 0)', () => {
        render(<GraficoDeslocamento deslocamentoComandado={[]} deslocamentoReal={[]} />);

        const referenceDot = screen.getByTestId('reference-dot');
        expect(referenceDot).toBeInTheDocument();
        expect(referenceDot).toHaveAttribute('data-x', '0');
        expect(referenceDot).toHaveAttribute('data-y', '0');
    });
});
