/**
 * Script to promote a user to ADMIN with ENTERPRISE subscription
 * Usage: npm run make-admin <email>
 * Example: npm run make-admin john@example.com
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    // Get email from command line arguments
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: npm run make-admin <email>');
      console.log('Example: npm run make-admin john@example.com');
      process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${email}`);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
    });

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Current Plan: ${user.subscriptionPlan}`);
    console.log('');
    console.log('🔄 Updating user to ADMIN with ENTERPRISE subscription...');

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        subscriptionPlan: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        subscriptionStartedAt: new Date(),
        subscriptionEndsAt: null, // No expiry for admin
        billingPeriod: null,
      },
    });

    console.log('');
    console.log('✅ SUCCESS! User has been promoted to ADMIN with ENTERPRISE plan!');
    console.log('');
    console.log('📋 Updated User Details:');
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Subscription Plan: ${updatedUser.subscriptionPlan}`);
    console.log(`   Subscription Status: ${updatedUser.subscriptionStatus}`);
    console.log('');
    console.log('🎉 You now have access to ALL features!');
    console.log('   - Unlimited projects');
    console.log('   - Unlimited storage');
    console.log('   - All advanced features');
    console.log('   - Admin privileges');
    console.log('');
    console.log('⚠️  Please log out and log back in for changes to take effect.');

  } catch (error) {
    console.error('❌ Error updating user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
