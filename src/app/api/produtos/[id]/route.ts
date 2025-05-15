import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar produto por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const produto = await prisma.estoque.findUnique({
      where: { id },
      include: {
        categoria: true, // Incluir informações da categoria
      },
    });

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ error: 'Falha ao buscar produto' }, { status: 500 });
  }
}

// PUT - Atualizar produto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const produto = await prisma.estoque.update({
      where: { id },
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

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ error: 'Falha ao atualizar produto' }, { status: 500 });
  }
}

// DELETE - Excluir produto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.estoque.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json({ error: 'Falha ao excluir produto' }, { status: 500 });
  }
}