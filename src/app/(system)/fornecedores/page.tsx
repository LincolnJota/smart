'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

async function getFornecedores() {
  const response = await fetch('/api/fornecedores');
  console.log('Status da resposta:', response.status);
  console.log('Status text:', response.statusText);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Sem detalhes do erro');
    console.error('Erro na resposta:', errorText);
    throw new Error(`Erro ao carregar fornecedores: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const data = await getFornecedores();
        setFornecedores(data);
      } catch (error) {
        console.error('Erro:', error);
        setErro(error instanceof Error ? error.message : 'Erro desconhecido ao carregar fornecedores');
      } finally {
        setIsLoading(false);
      }
    }

    carregarFornecedores();
  }, []);

  const excluirFornecedor = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        const response = await fetch(`/api/fornecedores/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== id));
        } else {
          throw new Error('Erro ao excluir fornecedor');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o fornecedor');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <Link href="/fornecedores/novo" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Novo Fornecedor
        </Link>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <p>Erro: {erro}</p>
          <p className="mt-2">
            Verifique se o servidor da API está rodando e se a conexão com o banco de dados está correta.
          </p>
        </div>
      )}

      {isLoading ? (
        <p>Carregando fornecedores...</p>
      ) : fornecedores.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{fornecedor.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fornecedor.cnpj || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fornecedor.telefone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{fornecedor.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${fornecedor.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/fornecedores/${fornecedor.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      Detalhes
                    </Link>
                    <Link href={`/fornecedores/${fornecedor.id}/editar`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Editar
                    </Link>
                    <button
                      onClick={() => excluirFornecedor(fornecedor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Nenhum fornecedor cadastrado.</p>
          <Link href="/fornecedores/novo" className="text-blue-600 hover:underline mt-2 inline-block">
            Cadastrar um fornecedor
          </Link>
        </div>
      )}
    </div>
  );
}