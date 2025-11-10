import prisma from '../config/db';

async function initTeamMember() {
  try {
    console.log('🚀 Initializing team member...\n');

    // Get the first user (the test user)
    const user = await prisma.user.findFirst({
      where: { email: 'testing@gmail.com' }
    });

    if (!user) {
      console.log('❌ No user found with email testing@gmail.com');
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);

    // Check if already a team member
    const existingMember: any = await (prisma as any).teamMember.findFirst({
      where: {
        userId: user.id,
        teamId: 'default'
      }
    });

    if (existingMember) {
      console.log(`\n⚠️  User is already a team member with role: ${existingMember.role}`);
      
      // Update to OWNER
      await (prisma as any).teamMember.update({
        where: { id: existingMember.id },
        data: { role: 'OWNER' }
      });
      
      console.log(`\n✅ Role updated to OWNER`);
    } else {
      // Add as team owner
      await (prisma as any).teamMember.create({
        data: {
          userId: user.id,
          teamId: 'default',
          role: 'OWNER',
        }
      });

      console.log(`\n✅ Successfully added as team OWNER`);
    }

    console.log('\n🎉 Team initialization complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initTeamMember();
