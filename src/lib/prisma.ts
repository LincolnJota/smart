import { PrismaClient } from '@prisma/client';

// Declarar uma variável global para o PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Usar um cliente PrismaClient global para evitar múltiplas instâncias
const prisma = global.prisma || new PrismaClient();

// Em desenvolvimento, salvamos o prisma na global para evitar múltiplas instâncias
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;