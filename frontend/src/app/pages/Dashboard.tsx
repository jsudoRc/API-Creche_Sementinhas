import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Users, Baby, BookOpen, AlertCircle, Loader2, RefreshCcw, CalendarDays } from 'lucide-react';
import { AlunoService, TurmaService, MatriculaService, Aluno, Turma, Matricula } from '../services/api';

interface DashboardData {
  alunos: Aluno[];
  turmas: Turma[];
  matriculas: Matricula[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    alunos: [],
    turmas: [],
    matriculas: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (isAxiosError(err)) {
      const responseData = err.response?.data as { message?: string; error?: string; details?: Array<{ message?: string }> } | undefined;
      const detail = responseData?.details?.find(item => item.message)?.message;
      return detail || responseData?.message || responseData?.error || fallback;
    }

    return fallback;
  };

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [alunosResponse, turmasResponse, matriculasResponse] = await Promise.all([
        AlunoService.getAll(),
        TurmaService.getAll(),
        MatriculaService.getAll(),
      ]);

      setData({
        alunos: alunosResponse.data,
        turmas: turmasResponse.data,
        matriculas: matriculasResponse.data,
      });
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError(getApiErrorMessage(err, 'Não foi possível carregar os dados do dashboard.'));
    } finally {
      setLoading(false);
    }
  };

  const alunosPorTurma = data.turmas.map(turma => ({
    turma,
    alunos: data.alunos.filter(aluno => aluno.turma_id === turma.id),
  }));

  const totalAlunos = data.alunos.length;
  const totalTurmas = data.turmas.length;
  const totalMatriculas = data.matriculas.length;
  const totalAndarilhas = data.alunos.filter(aluno => aluno.andarilha === 1).length;
  const capacidadeTotal = data.turmas.reduce((total, turma) => total + turma.capacidade, 0);
  const vagasDisponiveis = Math.max(0, capacidadeTotal - totalAlunos);
  const ocupacaoGeral = capacidadeTotal > 0 ? Math.round((totalAlunos / capacidadeTotal) * 100) : 0;

  const stats = [
    {
      title: 'Total de Alunos',
      value: String(totalAlunos),
      icon: Users,
      color: 'bg-blue-500',
      change: `${totalMatriculas} matrícula(s)`
    },
    {
      title: 'Turmas Ativas',
      value: String(totalTurmas),
      icon: BookOpen,
      color: 'bg-green-500',
      change: `${vagasDisponiveis} vaga(s) disponíveis`
    },
    {
      title: 'Ocupação Geral',
      value: `${ocupacaoGeral}%`,
      icon: CalendarDays,
      color: 'bg-purple-500',
      change: `${totalAlunos}/${capacidadeTotal || 0} capacidade`
    },
    {
      title: 'Andarilhas',
      value: String(totalAndarilhas),
      icon: AlertCircle,
      color: 'bg-amber-500',
      change: 'Atenção especial'
    }
  ];

  const atividadesRecentes = data.matriculas
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(matricula => {
      const aluno = data.alunos.find(item => item.id === matricula.aluno_id);
      const turma = aluno ? data.turmas.find(item => item.id === aluno.turma_id) : undefined;

      return {
        id: matricula.id,
        student: aluno?.nome || `Aluno #${matricula.aluno_id}`,
        action: `Matrícula ${matricula.plano}`,
        date: formatarData(matricula.inicio_vigencia),
        turma: turma?.nome || 'Turma não encontrada',
      };
    });

  function formatarData(dataIso: string) {
    if (!dataIso) return '—';
    const [ano, mes, dia] = dataIso.slice(0, 10).split('-');
    if (!ano || !mes || !dia) return dataIso;
    return `${dia}/${mes}/${ano}`;
  }

  const getOcupacaoColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600 bg-red-50';
    if (percent >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#4A7C4E]" />
        <p className="text-slate-600 text-sm font-medium">Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto my-8">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Erro de Conexão</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button
          type="button"
          onClick={carregarDashboard}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-500">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Matrículas Recentes</h3>
          </div>
          <div className="p-6">
            {atividadesRecentes.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma matrícula encontrada.</p>
            ) : (
              <div className="space-y-4">
                {atividadesRecentes.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center font-medium">
                        {activity.student.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{activity.student}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-1">
                        {activity.turma}
                      </span>
                      <p className="text-sm text-slate-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Turmas Overview */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Ocupação por Turma</h3>
          </div>
          <div className="p-6 space-y-4">
            {alunosPorTurma.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma turma cadastrada.</p>
            ) : (
              alunosPorTurma.map(({ turma, alunos }) => {
                const percent = turma.capacidade > 0 ? Math.round((alunos.length / turma.capacidade) * 100) : 0;

                return (
                  <div key={turma.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4 text-[#4A7C4E]" />
                        <span className="text-sm font-semibold text-slate-800">{turma.nome}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getOcupacaoColor(percent)}`}>
                        {alunos.length}/{turma.capacidade}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4A7C4E] transition-all duration-300"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
