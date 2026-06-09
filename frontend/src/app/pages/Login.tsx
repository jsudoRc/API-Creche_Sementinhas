import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, Leaf, Loader2, Lock, Mail, Sprout } from 'lucide-react';
import { AuthService, Funcionario } from '../services/api';

interface LoginProps {
  onLogin: (funcionario: Omit<Funcionario, 'senha'>) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('teste@sementinhas.com');
  const [senha, setSenha] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (isAxiosError(err)) {
      const data = err.response?.data as { error?: string; message?: string; details?: Array<{ message?: string }> } | undefined;
      const detail = data?.details?.find(item => item.message)?.message;
      return detail || data?.error || data?.message || fallback;
    }

    return fallback;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !senha.trim()) {
      setError('Informe e-mail e senha para entrar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login(email.trim(), senha);
      onLogin(response.data);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(getApiErrorMessage(err, 'Não foi possível entrar. Verifique suas credenciais.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#102616] via-[#23452A] to-[#5E7F3D] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(191,219,126,0.22),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(122,161,82,0.2),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(13,45,26,0.55),transparent_34%)]" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#B7D36A]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-80px] w-96 h-96 bg-[#0B1F12]/50 rounded-full blur-3xl" />
      <div className="absolute top-12 right-16 hidden md:flex items-center gap-2 text-green-50/80">
        <Leaf className="h-6 w-6" />
        <span className="text-sm font-semibold">Creche Sementinhas</span>
      </div>

      <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_420px] bg-[#F7FAF0]/92 backdrop-blur border border-white/30 shadow-2xl rounded-2xl overflow-hidden relative z-10">
        <div className="bg-[#4A7C4E] text-white p-10 lg:p-12 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/15 px-4 py-2 rounded-full mb-8">
              <Sprout className="h-5 w-5" />
              <span className="text-sm font-semibold">Um lugar para crescer</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Bem-vindo ao jardim da Sementinhas
            </h1>
            <p className="text-green-50 text-lg leading-relaxed max-w-xl">
              Acesse o sistema para acompanhar matrículas, turmas, alunos e documentos da creche.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-10">
            {['Cuidado', 'Rotina', 'Crescimento'].map(item => (
              <div key={item} className="bg-white/12 rounded-xl p-4 border border-white/10">
                <Leaf className="h-5 w-5 mb-2 text-green-100" />
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4E2] text-[#4A7C4E] flex items-center justify-center mb-4">
              <Sprout className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Entrar no sistema</h2>
            <p className="text-sm text-slate-500 mt-1">Use o e-mail e senha de funcionário.</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">E-mail</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent outline-none"
                  placeholder="funcionario@sementinhas.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Senha</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent outline-none"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 bg-[#4A7C4E] text-white rounded-lg font-semibold hover:bg-[#3D6640] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            Entrar
          </button>

          <div className="mt-6 bg-[#F6FAF2] border border-[#D7E8C8] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#4A7C4E] uppercase tracking-wide mb-1">Acesso de teste</p>
            <p className="text-sm text-slate-700">E-mail: <strong>teste@sementinhas.com</strong></p>
            <p className="text-sm text-slate-700">Senha: <strong>123456</strong></p>
          </div>
        </form>
      </section>
    </main>
  );
}
