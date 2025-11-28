"use client"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

interface Ponto {
  x: number;
  y: number;
}

interface GraficoDeslocamentoProps {
  deslocamentoComandado: Ponto[];
  deslocamentoReal: Ponto[];
}

export default function GraficoDeslocamento({ deslocamentoComandado, deslocamentoReal }: GraficoDeslocamentoProps) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="X" unit="cm" domain={['auto', 'auto']} />
        <YAxis type="number" dataKey="y" name="Y" unit="cm" domain={['auto', 'auto']} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Comandado" data={deslocamentoComandado} fill="#8884d8" line shape="circle" />
        <Scatter name="Real" data={deslocamentoReal} fill="#82ca9d" line shape="circle" />
        <ReferenceDot x={0} y={0} r={5} fill="red" stroke="none" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
