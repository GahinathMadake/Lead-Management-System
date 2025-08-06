import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default testDbConnection;