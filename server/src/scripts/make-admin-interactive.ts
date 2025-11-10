/**
 * Quick script to list all users and make one admin
 * Usage: npm run make-admin-interactive
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function makeAdminInteractive() {
  try {
    console.log('👥 Fetching all users...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database');
      process.exit(0);
    }

    console.log('📋 Available Users:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Plan: ${user.subscriptionPlan} (${user.subscriptionStatus})`);
      console.log('');
    });

    const answer = await question('Enter the number of the user to make ADMIN (or "q" to quit): ');

    if (answer.toLowerCase() === 'q') {
      console.log('Cancelled.');
      process.exit(0);
    }

    const userIndex = parseInt(answer) - 1;

    if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
      console.error('❌ Invalid selection');
      process.exit(1);
    }

    const selectedUser = users[userIndex];

    if (!selectedUser) {
      console.error('❌ User not found');
      process.exit(1);
    }

    console.log(`\n🔄 Updating ${selectedUser.name} to ADMIN with ENTERPRISE subscription...`);

    const updatedUser = await prisma.user.update({
      where: { id: selectedUser.id },
      data: {
        role: 'ADMIN',
        subscriptionPlan: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        subscriptionStartedAt: new Date(),
        subscriptionEndsAt: null,
        billingPeriod: null,
      },
    });

    console.log('\n✅ SUCCESS!\n');
    console.log('📋 Updated User:');
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Plan: ${updatedUser.subscriptionPlan}`);
    console.log(`   Status: ${updatedUser.subscriptionStatus}`);
    console.log('\n🎉 User now has access to ALL features!');
    console.log('⚠️  Please log out and log back in for changes to take effect.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

makeAdminInteractive();
