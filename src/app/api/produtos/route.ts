import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.estoque.findMany({
      include: {
        categoria: true, // Incluir informações da categoria
      },
    });
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Falha ao buscar produtos' }, { status: 500 });
  }
}

// POST - Criar novo produto
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const produto = await prisma.estoque.create({
      data: {
        nome: data.nome,
        codigo_sku: data.codigo_sku || null,
        codigo_barras: data.codigo_barras || null,
        categoriaId: data.categoriaId ? parseInt(data.categoriaId) : null,
        quantidade: parseInt(data.quantidade) || 0,
        estoque_minimo: parseInt(data.estoque_minimo) || 0,
        preco_venda: data.preco_venda ? parseFloat(data.preco_venda) : null,
        preco_custo: data.preco_custo ? parseFloat(data.preco_custo) : null,
        localizacao: data.localizacao || null,
      },
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ error: 'Falha ao criar produto' }, { status: 500 });
  }
}