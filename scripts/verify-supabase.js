#!/usr/bin/env node

/**
 * Script per verificare la connessione Supabase e creare le tabelle
 * Esegui: npm run setup-db
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verifica configurazione Supabase...\n');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL mancante in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key-here') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY mancante o non configurata in .env.local');
  console.log('\n📖 Per configurarla:');
  console.log('1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api');
  console.log('2. Copia la "service_role" key (clicca "Reveal")');
  console.log('3. Incollala in .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('✅ URL Supabase:', supabaseUrl);
  console.log('✅ Service Key configurata\n');

  console.log('🧪 Test connessione Supabase...');
  
  // Test connessione
  const { data, error } = await supabase.from('_test').select('*').limit(1);
  
  if (error && !error.message.includes('does not exist')) {
    console.error('❌ Errore connessione:', error.message);
    process.exit(1);
  }

  console.log('✅ Connessione Supabase OK!\n');

  // Verifica se la tabella evaluations esiste
  console.log('🔍 Verifica tabelle database...');
  const { data: tables, error: tablesError } = await supabase
    .from('evaluations')
    .select('id')
    .limit(1);

  if (tablesError) {
    if (tablesError.message.includes('does not exist')) {
      console.log('⚠️  Tabella "evaluations" non trovata\n');
      console.log('📋 Per creare il database:');
      console.log('1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor');
      console.log('2. Clicca "SQL Editor" nel menu laterale');
      console.log('3. Clicca "New query"');
      console.log('4. Copia e incolla il contenuto di: supabase_schema.sql');
      console.log('5. Clicca "Run" (o CMD+Enter)\n');
      console.log('✨ Oppure usa il metodo manuale nel dashboard!\n');
    } else {
      console.error('❌ Errore:', tablesError.message);
    }
  } else {
    console.log('✅ Tabella "evaluations" trovata!\n');
    console.log('🎉 Database già configurato correttamente!\n');
  }

  // Verifica autenticazione
  console.log('🔍 Verifica configurazione autenticazione...');
  console.log('📋 Assicurati che:');
  console.log('1. Email provider sia abilitato');
  console.log('2. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers');
  console.log('3. Abilita "Email" se non è già attivo\n');

  console.log('✅ Setup verificato!');
  console.log('\n🚀 Prossimo step:');
  console.log('   npm run dev\n');
}

setupDatabase().catch((error) => {
  console.error('❌ Errore:', error.message);
  process.exit(1);
});
