import { auth } from '../config/firebase';

/**
 * Set admin role for a user
 * Usage: ts-node scripts/setAdminRole.ts <user-email>
 */
async function setAdminRole(email: string) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`Successfully set admin role for ${email}`);
    console.log(`User ID: ${user.uid}`);
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

const email = process.argv[2];
if (!email) {
  console.error('Please provide email: ts-node scripts/setAdminRole.ts <email>');
  process.exit(1);
}

setAdminRole(email);