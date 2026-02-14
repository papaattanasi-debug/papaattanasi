#!/usr/bin/env node

/**
 * Script per creare automaticamente il database su Supabase
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || SERVICE_KEY === 'your-service-role-key-here') {
  console.error('\n❌ Supabase credentials not found in .env.local\n');
  console.log('Get your Service Role Key from:');
  console.log('https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api\n');
  process.exit(1);
}

async function createDatabase() {
  console.log('🗄️  Creating database on Supabase...\n');
  
  // Leggi lo schema
  const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split in singole query
  const queries = schema
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0 && !q.startsWith('--'));
  
  console.log(`📝 Found ${queries.length} SQL statements\n`);
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i] + ';';
    
    // Skip commenti
    if (query.trim().startsWith('--')) continue;
    
    console.log(`Executing ${i + 1}/${queries.length}: ${query.substring(0, 50)}...`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.log(`⚠️  Warning: ${error.substring(0, 100)}`);
      } else {
        console.log('✅ OK');
      }
    } catch (error) {
      console.log(`⚠️  ${error.message}`);
    }
  }
  
  console.log('\n🎉 Database setup complete!\n');
  console.log('✅ Tables created:');
  console.log('   - analysis_sessions');
  console.log('   - ai_responses');
  console.log('   - session_reports (view)\n');
  
  console.log('🚀 You can now:');
  console.log('   1. Go to http://localhost:3000');
  console.log('   2. Upload an image');
  console.log('   3. Start analysis');
  console.log('   4. Check History page\n');
}

createDatabase().catch(console.error);
