'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Não vamos usar o React.use para params neste componente client
export default function EditarFornecedor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fornecedorId = params.id;

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    ativo: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState('');

  // Carregar dados do fornecedor
  useEffect(() => {
    async function carregarFornecedor() {
      try {
        const response = await fetch(`/api/fornecedores/${fornecedorId}`);

        if (!response.ok) {
          throw new Error('Fornecedor não encontrado');
        }

        const fornecedor = await response.json();
        setFormData({
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj || '',
          telefone: fornecedor.telefone || '',
          email: fornecedor.email || '',
          endereco: fornecedor.endereco || '',
          ativo: fornecedor.ativo,
        });
      } catch (error) {
        console.error('Erro ao carregar fornecedor:', error);
        setErro('Não foi possível carregar os dados do fornecedor.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarFornecedor();
  }, [fornecedorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErro('');

    try {
      const res = await fetch(`/api/fornecedores/${fornecedorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao atualizar fornecedor');
      }

      router.push('/fornecedores');
    } catch (error) {
      console.error('Erro:', error);
      setErro('Falha ao atualizar o fornecedor. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Carregando dados do fornecedor...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Fornecedor</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="nome" className="block mb-1 font-medium">
                Nome*
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="cnpj" className="block mb-1 font-medium">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block mb-1 font-medium">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="endereco" className="block mb-1 font-medium">
                Endereço
              </label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                  Fornecedor ativo
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}