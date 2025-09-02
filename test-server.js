#!/usr/bin/env node

// Test script to verify MCP server is working
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing MCP Football API Server...');
console.log('=====================================');

const serverPath = path.join(__dirname, 'dist', 'index.js');
console.log(`Server path: ${serverPath}`);

// Start the server
const server = spawn('node', [serverPath], {
  env: {
    ...process.env,
    FOOTBALL_API_URL: 'http://185.240.104.144'
  }
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`[STDOUT]: ${data}`);
});

server.stderr.on('data', (data) => {
  console.log(`[STDERR]: ${data}`);
});

server.on('error', (error) => {
  console.error(`Error starting server: ${error.message}`);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Send test messages after a short delay
setTimeout(() => {
  console.log('\nSending test request...');
  
  // Send a list tools request
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(testRequest) + '\n');
  
  // Exit after 2 seconds
  setTimeout(() => {
    console.log('\nTest completed. Shutting down...');
    server.kill();
    process.exit(0);
  }, 2000);
}, 1000);

console.log('\nPress Ctrl+C to stop the test.');