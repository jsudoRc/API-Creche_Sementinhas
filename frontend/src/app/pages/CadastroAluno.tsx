import { useState, useEffect } from 'react';
import { Save, Upload, User, Baby, DollarSign, FileText, Loader2 } from 'lucide-react';
import { AlunoService, TurmaService, Turma } from '../services/api'; // Ajuste o caminho conforme seu projeto

export default function CadastroAluno() {
  const [step, setStep] = useState(1);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<Turma[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Dados do Aluno
    nomeAluno: '',
    dataNascimento: '',
    andarilha: false,

    // Dados dos Pais
    nomeMae: '',
    cpfMae: '',
    telefoneMae: '',
    emailMae: '',
    nomePai: '',
    cpfPai: '',
    telefonePai: '',
    emailPai: '',

    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: 'São Paulo',
    estado: 'SP',

    // Responsável Financeiro
    responsavelFinanceiro: '',
    cpfResponsavel: '',
    profissao: '',

    // Matrícula
    turma_id: '', // Mudamos de 'turma' para 'turma_id' para linkar com o banco
    planoContratado: 'integral',
    periodo: '',
    dataVencimento: '10',
    vigenciaContrato: '12',
    valorMensalidade: '',

    // Outros
    autorizacaoImagem: false,
    formaPagamento: 'boleto',
  });

  // Carrega as turmas do banco de dados assim que a tela abre
  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const response = await TurmaService.getAll();
        setTurmasDisponiveis(response.data);
      } catch (error) {
        console.error("Erro ao carregar turmas", error);
        alert("Erro ao carregar a lista de turmas. Verifique sua conexão.");
      }
    };
    carregarTurmas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui nós moldamos o objeto exatamente como a sua API (Zod) vai esperar
      const payload = {
        aluno: {
          nome: formData.nomeAluno,
          data_nasc: formData.dataNascimento,
          andarilha: formData.andarilha ? 1 : 0, // SQLite costuma usar 1 e 0 para booleanos
          turma_id: Number(formData.turma_id)
        },
        // Opcional: Se sua API já estiver preparada para receber dados dos responsáveis
        responsaveis: [
          { nome: formData.nomeMae, cpf: formData.cpfMae, telefone: formData.telefoneMae, tipo: 'mãe' },
          { nome: formData.nomePai, cpf: formData.cpfPai, telefone: formData.telefonePai, tipo: 'pai' }
        ].filter(r => r.nome !== ''), // Filtra para enviar só quem foi preenchido
        
        financeiro: {
          responsavel: formData.responsavelFinanceiro,
          cpf_responsavel: formData.cpfResponsavel,
          plano: formData.planoContratado,
          valor: parseFloat(formData.valorMensalidade.replace('R$', '').replace(',', '.').trim()),
          dia_vencimento: Number(formData.dataVencimento)
        }
      };

      // Chama a API para salvar
      await AlunoService.create(payload);

      alert('Matrícula realizada com sucesso! Contrato e ficha de anamnese foram gerados.');
      
      // Limpa o formulário e volta pro passo 1
      setStep(1);
      // Você pode adicionar aqui um window.location.reload() ou redirecionar para a Lista
      
    } catch (error) {
      console.error('Erro ao salvar matrícula:', error);
      alert('Erro ao realizar a matrícula. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <Baby className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Dados do Aluno</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo do Aluno *</label>
          <input type="text" name="nomeAluno" value={formData.nomeAluno} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Data de Nascimento *</label>
          <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input type="checkbox" name="andarilha" checked={formData.andarilha} onChange={handleInputChange} className="w-5 h-5 text-[#4A7C4E] border-slate-300 rounded focus:ring-[#4A7C4E]" />
          <label className="text-sm font-medium text-slate-700">Criança Andarilha (necessita atenção especial de turma)</label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Dados dos Responsáveis</h3>
      </div>

      <div className="space-y-8">
        {/* Mãe */}
        <div className="border-b border-slate-200 pb-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Mãe</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo *</label>
              <input type="text" name="nomeMae" value={formData.nomeMae} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CPF *</label>
              <input type="text" name="cpfMae" value={formData.cpfMae} onChange={handleInputChange} placeholder="000.000.000-00" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Telefone *</label>
              <input type="tel" name="telefoneMae" value={formData.telefoneMae} onChange={handleInputChange} placeholder="(11) 99999-9999" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
              <input type="email" name="emailMae" value={formData.emailMae} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Pai */}
        <div className="border-b border-slate-200 pb-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Pai</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
              <input type="text" name="nomePai" value={formData.nomePai} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CPF</label>
              <input type="text" name="cpfPai" value={formData.cpfPai} onChange={handleInputChange} placeholder="000.000.000-00" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
              <input type="tel" name="telefonePai" value={formData.telefonePai} onChange={handleInputChange} placeholder="(11) 99999-9999" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
              <input type="email" name="emailPai" value={formData.emailPai} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h4 className="text-lg font-medium text-slate-800 mb-4">Endereço</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CEP *</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bairro *</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Endereço *</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Número *</label>
              <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Complemento</label>
              <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Dados da Matrícula</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Turma *</label>
          <select 
            name="turma_id" 
            value={formData.turma_id} 
            onChange={handleInputChange} 
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" 
            required
          >
            <option value="">Selecione...</option>
            {/* Aqui mapeamos as turmas vindas do banco de dados */}
            {turmasDisponiveis.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Plano Contratado *</label>
          <select name="planoContratado" value={formData.planoContratado} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required>
            <option value="integral">Integral (06:30 às 18:00)</option>
            <option value="parcial-manha">Parcial Manhã (06:30 às 12:30)</option>
            <option value="parcial-tarde">Parcial Tarde (12:00 às 18:00)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Dia de Vencimento *</label>
          <select name="dataVencimento" value={formData.dataVencimento} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required>
            <option value="10">Dia 10</option>
            <option value="25">Dia 25</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Vigência do Contrato (meses) *</label>
          <input type="number" name="vigenciaContrato" value={formData.vigenciaContrato} onChange={handleInputChange} min="1" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Valor da Mensalidade *</label>
          <input type="text" name="valorMensalidade" value={formData.valorMensalidade} onChange={handleInputChange} placeholder="R$ 0,00" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento Matrícula *</label>
          <select name="formaPagamento" value={formData.formaPagamento} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required>
            <option value="boleto">Boleto à vista</option>
            <option value="boleto-parcelado">Boleto parcelado (3x)</option>
            <option value="cartao">Cartão à vista</option>
            <option value="cartao-parcelado">Cartão parcelado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Responsável Financeiro *</label>
          <input type="text" name="responsavelFinanceiro" value={formData.responsavelFinanceiro} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CPF Responsável *</label>
          <input type="text" name="cpfResponsavel" value={formData.cpfResponsavel} onChange={handleInputChange} placeholder="000.000.000-00" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Profissão *</label>
          <input type="text" name="profissao" value={formData.profissao} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent" required />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-4">
          <input type="checkbox" name="autorizacaoImagem" checked={formData.autorizacaoImagem} onChange={handleInputChange} className="w-5 h-5 text-[#4A7C4E] border-slate-300 rounded focus:ring-[#4A7C4E]" />
          <label className="text-sm font-medium text-slate-700">Autorizo a imagem de minha criança em site, redes sociais e mídias exclusivas da Sementinhas</label>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Documentos</h3>
      </div>
      {/* Nota: Para envio real de arquivos, precisaremos mudar o 'Content-Type' da requisição para 'multipart/form-data' no futuro */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 mb-2">Foto 3x4 do aluno</p>
          <button type="button" className="px-4 py-2 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors">Selecionar arquivo</button>
        </div>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 mb-2">Certidão de Nascimento</p>
          <button type="button" className="px-4 py-2 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors">Selecionar arquivo</button>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg shadow-md border border-slate-200">
        {/* Progress Steps */}
        <div className="border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s <= step ? 'bg-[#4A7C4E] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-[#4A7C4E]' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm hidden md:flex">
            <span className={step >= 1 ? 'text-[#4A7C4E] font-medium' : 'text-slate-500'}>Dados do Aluno</span>
            <span className={step >= 2 ? 'text-[#4A7C4E] font-medium' : 'text-slate-500'}>Responsáveis</span>
            <span className={step >= 3 ? 'text-[#4A7C4E] font-medium' : 'text-slate-500'}>Matrícula</span>
            <span className={step >= 4 ? 'text-[#4A7C4E] font-medium' : 'text-slate-500'}>Documentos</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="border-t border-slate-200 px-8 py-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isSubmitting}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="flex gap-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Finalizar Matrícula
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}