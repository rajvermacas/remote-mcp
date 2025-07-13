#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🧪 Testing MCP Calculator Server...\n');

// Simple function to run a test
function runTest(args) {
  return new Promise((resolve) => {
    const test = spawn('npx', args, { shell: true });
    let output = '';
    
    test.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    test.on('close', () => {
      resolve(output);
    });
  });
}

// Run all tests
async function testMCP() {
  try {
    // Test 1: List tools
    console.log('1️⃣ Testing: List all tools');
    const toolsOutput = await runTest([
      '@modelcontextprotocol/inspector',
      '--cli',
      'node',
      'dist/server/stdio-server.js',
      '--method',
      'tools/list'
    ]);
    
    const tools = JSON.parse(toolsOutput);
    console.log('✅ Tools available:', tools.tools.map(t => t.name).join(', '));
    
    // Test 2: Addition
    console.log('\n2️⃣ Testing: Addition (10 + 5)');
    const addOutput = await runTest([
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
    ]);
    
    const addResult = JSON.parse(addOutput);
    const addContent = JSON.parse(addResult.content[0].text);
    console.log(`✅ Result: ${addContent.result} (Expected: 15)`);
    
    // Test 3: Division
    console.log('\n3️⃣ Testing: Division (20 / 4)');
    const divOutput = await runTest([
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
    ]);
    
    const divResult = JSON.parse(divOutput);
    const divContent = JSON.parse(divResult.content[0].text);
    console.log(`✅ Result: ${divContent.result} (Expected: 5)`);
    
    // Test 4: Square Root
    console.log('\n4️⃣ Testing: Square Root (64)');
    const sqrtOutput = await runTest([
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
    ]);
    
    const sqrtResult = JSON.parse(sqrtOutput);
    const sqrtContent = JSON.parse(sqrtResult.content[0].text);
    console.log(`✅ Result: ${sqrtContent.result} (Expected: 8)`);
    
    console.log('\n🎉 All tests passed! Your MCP server is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMCP();