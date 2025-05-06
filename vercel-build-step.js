const { execSync } = require('child_process');

// Exécution de prisma generate pendant le build de Vercel
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate');
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}