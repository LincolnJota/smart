'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarCategorias();
  }, []);

  const excluirCategoria = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        const response = await fetch(`/api/categorias/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir categoria');
        }

        setCategorias(categorias.filter(categoria => categoria.id !== id));
      } catch (error) {
        console.error('Erro:', error);
        alert(error instanceof Error ? error.message : 'Erro ao excluir a categoria');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Link href="/categorias/nova" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Nova Categoria
        </Link>
      </div>

      {isLoading ? (
        <p>Carregando categorias...</p>
      ) : categorias.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{categoria.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{categoria.descricao || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {categoria.cor ? (
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: categoria.cor }}
                        ></div>
                        {categoria.cor}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/categorias/${categoria.id}/editar`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Editar
                    </Link>
                    <button
                      onClick={() => excluirCategoria(categoria.id)}
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
          <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
          <Link href="/categorias/nova" className="text-blue-600 hover:underline mt-2 inline-block">
            Cadastrar uma categoria
          </Link>
        </div>
      )}
    </div>
  );
}