import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@infistyle.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Securely hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('AdminPassword123', saltRounds);

    const admin = await prisma.user.create({
      data: {
        name: 'InfiStyle Admin',
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'admin',
        isEmailVerified: true,
        phone: '9999999999',
        companyName: 'InfiStyle Corporate',
        gstin: '27INFIS7777E1Z5',
        billingAddress: 'InfiStyle Hub, BKC, G-Block, Mumbai, Maharashtra - 400051',
        shippingAddress: 'InfiStyle Hub, BKC, G-Block, Mumbai, Maharashtra - 400051',
      },
    });

    console.log(`🟢 Default admin user seeded successfully: ${admin.email}`);
  } else {
    console.log('🟡 Default admin user already exists. Skipping seeding.');
  }
}

main()
  .catch((e) => {
    console.error('🔴 Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
