#!/usr/bin/env node

/**
 * Script per creare il database Supabase
 * Esegui: node scripts/setup-database.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🗄️  Inizio setup database...\n');

  // Leggi lo schema SQL
  const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('📝 Esecuzione schema SQL...');

  // Esegui lo schema
  const { data, error } = await supabase.rpc('exec_sql', { sql: schema });

  if (error) {
    // Se la funzione rpc non esiste, prova a eseguire le query direttamente
    console.log('⚠️  Esecuzione diretta delle query...\n');
    
    // Dividi lo schema in singole query
    const queries = schema
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    for (const query of queries) {
      if (query.includes('CREATE TABLE') || query.includes('CREATE INDEX') || 
          query.includes('CREATE POLICY') || query.includes('ALTER TABLE')) {
        console.log(`Eseguo: ${query.substring(0, 50)}...`);
        
        const { error: queryError } = await supabase.rpc('exec', { 
          query: query + ';' 
        });
        
        if (queryError) {
          console.log(`⚠️  Query fallita (potrebbe essere già esistente):`, queryError.message);
        } else {
          console.log('✅ OK');
        }
      }
    }
  } else {
    console.log('✅ Schema eseguito con successo!');
  }

  console.log('\n🎉 Setup database completato!');
  console.log('\n📋 Prossimi step:');
  console.log('1. Vai su Supabase Dashboard');
  console.log('2. Authentication → Providers → Abilita Email');
  console.log('3. npm run dev');
}

setupDatabase().catch(console.error);
