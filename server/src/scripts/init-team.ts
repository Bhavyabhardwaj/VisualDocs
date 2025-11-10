import prisma from '../config/db';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function initializeTeam() {
  try {
    console.log('🚀 Team Initialization Script\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      process.exit(1);
    }

    console.log('📋 Available users:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });

    const selection = await question('\nSelect user to add as team OWNER (enter number): ');
    const selectedIndex = parseInt(selection) - 1;

    if (selectedIndex < 0 || selectedIndex >= users.length) {
      console.log('❌ Invalid selection');
      process.exit(1);
    }

    const selectedUser = users[selectedIndex];

    if (!selectedUser) {
      console.log('❌ User not found');
      process.exit(1);
    }

    // Check if user is already a team member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        userId: selectedUser.id,
        teamId: 'default'
      }
    });

    if (existingMember) {
      console.log(`\n⚠️  ${selectedUser.name} is already a team member with role: ${existingMember.role}`);
      
      const updateRole = await question('\nUpdate to OWNER role? (yes/no): ');
      
      if (updateRole.toLowerCase() === 'yes') {
        await prisma.teamMember.update({
          where: { id: existingMember.id },
          data: { role: 'OWNER' }
        });
        console.log(`\n✅ ${selectedUser.name} role updated to OWNER`);
      }
    } else {
      // Add user as team owner
      await prisma.teamMember.create({
        data: {
          userId: selectedUser.id,
          teamId: 'default',
          role: 'OWNER',
        }
      });

      console.log(`\n✅ Successfully added ${selectedUser.name} as team OWNER`);
    }

    // Show team summary
    const allMembers: any = await prisma.teamMember.findMany({
      where: { teamId: 'default' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    console.log('\n📊 Current Team Members:');
    allMembers.forEach((member: any) => {
      console.log(`  - ${member.user.name} (${member.user.email}) - ${member.role}`);
    });

    console.log('\n🎉 Team initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing team:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

initializeTeam();
