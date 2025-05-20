#!/usr/bin/env bun

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', '⚠️ No .env file found. Creating from example...');
  
  // Check if .env.example exists
  const envExamplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('\x1b[32m%s\x1b[0m', '✅ Created .env file from .env.example');
    console.log('\x1b[33m%s\x1b[0m', '⚠️ Please update the .env file with your credentials');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ No .env.example file found. Please create a .env file manually.');
    process.exit(1);
  }
}

console.log('\x1b[36m%s\x1b[0m', '🚀 Initializing ByteBrush Links project...');

// Run prisma db push
console.log('\x1b[36m%s\x1b[0m', '📊 Setting up the database...');
exec('bun prisma db push', (error, stdout, stderr) => {
  if (error) {
    console.log('\x1b[31m%s\x1b[0m', '❌ Failed to set up database:');
    console.error(error);
    return;
  }
  
  console.log(stdout);
  console.log('\x1b[32m%s\x1b[0m', '✅ Database setup complete!');
  
  // Generate Prisma client
  console.log('\x1b[36m%s\x1b[0m', '📦 Generating Prisma client...');
  exec('bun prisma generate', (error, stdout, stderr) => {
    if (error) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Failed to generate Prisma client:');
      console.error(error);
      return;
    }
    
    console.log(stdout);
    console.log('\x1b[32m%s\x1b[0m', '✅ Prisma client generated!');
    
    console.log('\x1b[32m%s\x1b[0m', '🎉 ByteBrush Links project initialized successfully!');
    console.log('\x1b[36m%s\x1b[0m', 'ℹ️  Run the development server with:');
    console.log('\x1b[0m', '   bun dev');
    console.log('\x1b[36m%s\x1b[0m', 'ℹ️  Build for production with:');
    console.log('\x1b[0m', '   bun run build');
  });
});
