'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Componente para o seletor de cores que só é renderizado no cliente
const ColorPicker = ({ value, onChange }: { value: string, onChange: (color: string) => void }) => {
  return (
    <div className="flex items-center">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-1 border rounded mr-2"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 p-2 border rounded"
      />
    </div>
  );
};

export default function NovaCategoria() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#3b82f6', // Cor padrão azul
  });

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mounted, setMounted] = useState(false);

  // Usar useEffect para marcar quando o componente estiver montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      cor: color
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar categoria');
      }

      router.push('/categorias');
    } catch (error) {
      console.error('Erro:', error);
      setErro('Falha ao salvar a categoria. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nova Categoria</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
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
              <label htmlFor="descricao" className="block mb-1 font-medium">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="cor" className="block mb-1 font-medium">
                Cor
              </label>
              {/* Só renderizar o input de cor no lado do cliente */}
              {mounted ? (
                <ColorPicker value={formData.cor} onChange={handleColorChange} />
              ) : (
                <div className="h-10">Carregando seletor de cores...</div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Salvando...' : 'Salvar Categoria'}
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