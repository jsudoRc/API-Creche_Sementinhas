import { Baby, Users, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TurmaService, AlunoService, Turma, Aluno } from '../services/api';

// Criamos uma interface estendida para o Frontend que une a Turma com seus respectivos Alunos
interface TurmaComAlunos extends Turma {
  alunos: Aluno[];
}

export default function Turmas() {
  const [turmas, setTurmas] = useState<TurmaComAlunos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para os cards de estatísticas globais
  const [stats, setStats] = useState({
    totalTurmas: 0,
    totalAlunos: 0,
    capacidadeTotal: 0,
    vagasDisponiveis: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscando turmas e alunos em paralelo para otimizar a performance
      const [turmasResponse, alunosResponse] = await Promise.all([
        TurmaService.getAll(),
        AlunoService.getAll()
      ]);

      const listaTurmas: Turma[] = turmasResponse.data;
      const listaAlunos: Aluno[] = alunosResponse.data;

      // Cruza os dados: Vincula cada aluno à sua respectiva turma pelo turma_id
      const turmasFormatadas: TurmaComAlunos[] = listaTurmas.map((turma) => ({
        ...turma,
        alunos: listaAlunos.filter((aluno) => aluno.turma_id === turma.id)
      }));

      // Calcula os indicadores gerais dinamicamente com base no Banco de Dados
      const totalTurmas = turmasFormatadas.length;
      const totalAlunos = listaAlunos.length;
      const capacidadeTotal = turmasFormatadas.reduce((acc, t) => acc + t.capacidade, 0);
      const vagasDisponiveis = Math.max(0, capacidadeTotal - totalAlunos);

      setTurmas(turmasFormatadas);
      setStats({
        totalTurmas,
        totalAlunos,
        capacidadeTotal,
        vagasDisponiveis
      });

    } catch (err) {
      console.error("Erro ao carregar dados das turmas:", err);
      setError("Não foi possível carregar as informações das turmas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Helper para mapear cores dinâmicas baseadas no ID ou nome da turma (já que o banco não guarda a cor do Tailwind)
  const getTurmaColor = (periodo: string) => {
    if (periodo.toLowerCase().includes('integral')) return 'bg-purple-500';
    if (periodo.toLowerCase().includes('manhã')) return 'bg-blue-500';
    return 'bg-pink-500';
  };

  // Função auxiliar para calcular a idade a partir da data de nascimento (YYYY-MM-DD)
  const formatarIdade = (dataNasc: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();

    if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
      anos--;
      meses += 12;
    }

    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}${meses > 0 ? ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : ''}`;
  };

  const getOcupacaoPercent = (matriculados: number, capacidade: number) => {
    if (capacidade === 0) return 0;
    return (matriculados / capacidade) * 100;
  };

  const getOcupacaoColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600';
    if (percent >= 70) return 'text-amber-600';
    return 'text-green-600';
  };

  // Tela de carregamento (Feedback visual)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#4A7C4E]" />
        <p className="text-slate-600 text-sm font-medium">Carregando informações das turmas...</p>
      </div>
    );
  }

  // Tela de erro amigável
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto my-8">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Erro de Conexão</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button 
          onClick={carregarDados}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats (Dinâmicos) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Total de Turmas</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalTurmas}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Baby className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Total de Alunos</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalAlunos}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Capacidade Total</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.capacidadeTotal}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Vagas Disponíveis</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.vagasDisponiveis}</p>
        </div>
      </div>

      {/* Turmas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turmas.map((turma) => {
          const matriculadosCount = turma.alunos.length;
          const ocupacaoPercent = getOcupacaoPercent(matriculadosCount, turma.capacidade);
          const turmaCor = getTurmaColor(turma.periodo);

          return (
            <div key={turma.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className={`${turmaCor} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Baby className="h-6 w-6" />
                    <div>
                      <h3 className="text-lg font-bold">{turma.nome}</h3>
                      <p className="text-sm opacity-90">Idade: {turma.idade_min} a {turma.idade_max} anos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{matriculadosCount}/{turma.capacidade}</p>
                    <p className="text-xs opacity-90">alunos</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${ocupacaoPercent}%` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Período: {turma.periodo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      Mensalidade: R$ {turma.valor_mensal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Occupancy Alert */}
                {ocupacaoPercent >= 80 && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                    ocupacaoPercent >= 90 ? 'bg-red-50' : 'bg-amber-50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 flex-shrink-0 ${getOcupacaoColor(ocupacaoPercent)}`} />
                    <p className={`text-sm ${getOcupacaoColor(ocupacaoPercent)}`}>
                      {ocupacaoPercent >= 90
                        ? `Turma quase cheia! Apenas ${turma.capacidade - matriculadosCount} vaga(s) disponível(is).`
                        : 'Turma com alta ocupação'}
                    </p>
                  </div>
                )}

                {/* Student List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Alunos Matriculados nesta Turma:</h4>
                  
                  {matriculadosCount === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">Nenhum aluno matriculado nesta turma ainda.</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {turma.alunos.map((aluno) => (
                        <div key={aluno.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{aluno.nome}</p>
                              <p className="text-xs text-slate-500">{formatarIdade(aluno.data_nasc)}</p>
                            </div>
                          </div>
                          
                          {/* Em conformidade com o campo "andarilha" (INTEGER 0 ou 1) da sua tabela do Banco */}
                          {aluno.andarilha === 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full" title="Criança andarilha">
                              <Baby className="h-3 w-3" />
                              <span className="text-[10px]">Andarilha</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}