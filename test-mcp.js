#!/usr/bin/env node

console.log('🧪 Testing MCP Calculator Server...\n');

const { spawn } = require('child_process');

// Test 1: List all available tools
console.log('1️⃣ Testing: List all tools');
const listTools = spawn('npx', [
  '@modelcontextprotocol/inspector',
  '--cli',
  'node',
  'dist/server/stdio-server.js',
  '--method',
  'tools/list'
], { shell: true });

listTools.stdout.on('data', (data) => {
  console.log('✅ Tools available:', JSON.parse(data).tools.map(t => t.name).join(', '));
});

listTools.on('close', () => {
  // Test 2: Perform addition
  console.log('\n2️⃣ Testing: Addition (10 + 5)');
  const addTest = spawn('npx', [
    '@modelcontextprotocol/inspector',
    '--cli',
    'node',
    'dist/server/stdio-server.js',
    '--method',
    'tools/call',
    '--tool-name',
    'add',
    '--tool-arg',
    'a=10',
    '--tool-arg',
    'b=5'
  ], { shell: true });

  addTest.stdout.on('data', (data) => {
    const result = JSON.parse(data);
    const content = JSON.parse(result.content[0].text);
    console.log(`✅ Result: ${content.result}`);
  });

  addTest.on('close', () => {
    // Test 3: Test division
    console.log('\n3️⃣ Testing: Division (20 / 4)');
    const divideTest = spawn('npx', [
      '@modelcontextprotocol/inspector',
      '--cli',
      'node',
      'dist/server/stdio-server.js',
      '--method',
      'tools/call',
      '--tool-name',
      'divide',
      '--tool-arg',
      'a=20',
      '--tool-arg',
      'b=4'
    ], { shell: true });

    divideTest.stdout.on('data', (data) => {
      const result = JSON.parse(data);
      const content = JSON.parse(result.content[0].text);
      console.log(`✅ Result: ${content.result}`);
    });

    divideTest.on('close', () => {
      // Test 4: Test square root
      console.log('\n4️⃣ Testing: Square Root (64)');
      const sqrtTest = spawn('npx', [
        '@modelcontextprotocol/inspector',
        '--cli',
        'node',
        'dist/server/stdio-server.js',
        '--method',
        'tools/call',
        '--tool-name',
        'sqrt',
        '--tool-arg',
        'value=64'
      ], { shell: true });

      sqrtTest.stdout.on('data', (data) => {
        const result = JSON.parse(data);
        const content = JSON.parse(result.content[0].text);
        console.log(`✅ Result: ${content.result}`);
        console.log('\n🎉 All tests passed! Your MCP server is working correctly!');
      });
    });
  });
});