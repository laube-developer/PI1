"use client"
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getHistoricoById } from '../../../actions/actions';
import { Historico } from '@/entidades/historico';
import CodeView from '../../../components/CodeView';
import GraficoDeslocamento from '../../../components/GraficoDeslocamento';

export default function HistoricoDetailPage() {
    const [historico, setHistorico] = useState<Historico | null>(null);
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchHistorico = async () => {
                try {
                    const data = await getHistoricoById(id);
                    console.log("Dados do histórico no componente:", JSON.stringify(data, null, 2));
                    setHistorico(data);
                } catch (error) {
                    console.error(error);
                    alert('Erro ao buscar os detalhes do histórico.');
                }
            };

            fetchHistorico();
        }
    }, [id]);

    if (!historico) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Detalhes do Percurso de {new Date(historico.created_at).toLocaleString()}
                </h1>
                <button
                    onClick={() => router.push('/dashboard/historico')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Voltar
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-md shadow">
                    <h2 className="text-xl font-bold mb-4">Comandos</h2>
                    <CodeView code={JSON.stringify(historico.comandos, null, 2)} />
                </div>
                <div className="bg-white p-4 rounded-md shadow">
                    <h2 className="text-xl font-bold mb-4">Gráfico</h2>
                    <GraficoDeslocamento
                        deslocamentoComandado={historico.deslocamento_comandado}
                        deslocamentoReal={historico.deslocamento_real}
                    />
                </div>
            </div>
        </div>
    );
}
