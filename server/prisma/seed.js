const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const userA = await prisma.user.upsert({
    where: { username: 'supervisor_a' },
    update: {},
    create: {
      username: 'supervisor_a',
      password: hashedPassword,
      shift: 'Shift A (Morning)'
    }
  });

  const userB = await prisma.user.upsert({
    where: { username: 'supervisor_b' },
    update: {},
    create: {
      username: 'supervisor_b',
      password: hashedPassword,
      shift: 'Shift B (Evening)'
    }
  });

  // Seed sample inspection records for immediate evaluation
  const count = await prisma.inspection.count();
  if (count === 0) {
    await prisma.inspection.createMany({
      data: [
        {
          lineId: 'Loom-04',
          defectType: 'Weave Defect',
          severity: 'Critical',
          status: 'Open',
          remarks: 'Excessive warp slippage on harness 3',
          loggedById: userA.id,
          loggedAt: new Date(Date.now() - 3600000 * 4)
        },
        {
          lineId: 'Line-B2',
          defectType: 'Shade Variation',
          severity: 'Major',
          status: 'Open',
          remarks: 'Delta-E above threshold in dyeing run #204',
          loggedById: userA.id,
          loggedAt: new Date(Date.now() - 3600000 * 2)
        },
        {
          lineId: 'Spinning-01',
          defectType: 'Count Deviation',
          severity: 'Minor',
          status: 'Resolved',
          remarks: 'Yarn count drift detected',
          resolutionNote: 'Adjusted draft gear ratio and tested 10 lea samples.',
          loggedById: userA.id,
          resolvedById: userB.id,
          loggedAt: new Date(Date.now() - 3600000 * 24),
          resolvedAt: new Date(Date.now() - 3600000 * 20)
        }
      ]
    });
  }

  console.log('Seed completed successfully with default supervisors.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

