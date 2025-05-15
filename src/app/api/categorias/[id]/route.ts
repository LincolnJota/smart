import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar categoria por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        produtos: true, // Inclui produtos relacionados
      },
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json({ error: 'Falha ao buscar categoria' }, { status: 500 });
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        cor: data.cor || null,
      },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json({ error: 'Falha ao atualizar categoria' }, { status: 500 });
  }
}

// DELETE - Excluir categoria
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Verificar se existem produtos associados à categoria
    const produtosAssociados = await prisma.estoque.count({
      where: { categoriaId: id },
    });

    if (produtosAssociados > 0) {
      return NextResponse.json({
        error: 'Não é possível excluir a categoria pois existem produtos associados a ela'
      }, { status: 400 });
    }

    await prisma.categoria.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json({ error: 'Falha ao excluir categoria' }, { status: 500 });
  }
}