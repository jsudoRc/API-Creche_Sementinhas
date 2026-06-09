import { Users, Baby, BookOpen, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total de Alunos',
      value: '48',
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 este mês'
    },
    {
      title: 'Berçário',
      value: '12',
      icon: Baby,
      color: 'bg-pink-500',
      change: '0-1 ano'
    },
    {
      title: 'Maternais',
      value: '36',
      icon: BookOpen,
      color: 'bg-green-500',
      change: '1-3 anos'
    },
    {
      title: 'Andarilhas',
      value: '4',
      icon: AlertCircle,
      color: 'bg-amber-500',
      change: 'Atenção especial'
    }
  ];

  const recentActivities = [
    { id: 1, student: 'Maria Silva', action: 'Matrícula realizada', date: '07/06/2026', turma: 'Berçário' },
    { id: 2, student: 'João Santos', action: 'Atualização cadastral', date: '06/06/2026', turma: 'Maternal 1' },
    { id: 3, student: 'Ana Costa', action: 'Mudança de turma', date: '05/06/2026', turma: 'Maternal 2' },
    { id: 4, student: 'Pedro Oliveira', action: 'Ficha de anamnese atualizada', date: '04/06/2026', turma: 'Maternal 1' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
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

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Atividades Recentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center font-medium">
                    {activity.student.split(' ').map(n => n[0]).join('')}
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
        </div>
      </div>
    </div>
  );
}
