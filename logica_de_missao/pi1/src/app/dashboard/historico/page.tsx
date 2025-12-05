"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { getHistorico } from '../../actions/actions';
import { Historico } from '@/entidades/historico';
import { User } from '@/entidades/user';

export default function HistoricoPage() {
    const [historicos, setHistoricos] = useState<Historico[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndHistorico = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user as User);

            try {
                const data = await getHistorico(session.user.id);
                setHistoricos(data);
            } catch (error) {
                console.error(error);
                alert('Erro ao buscar o histórico.');
            }
        };

        fetchUserAndHistorico();
    }, [router]);

    if (!user) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Percursos</h1>
            <div className="bg-white p-4 rounded-md shadow">
                {historicos.length === 0 ? (
                    <p>Nenhum histórico encontrado.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {historicos.map((historico) => (
                            <li key={historico.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">Percurso de {new Date(historico.created_at).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">{historico.comandos.length} comandos</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/dashboard/historico/${historico.id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Ver Detalhes
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
