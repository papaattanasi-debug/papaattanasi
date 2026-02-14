# 🧪 Guida al Testing dell'Applicazione

## 🚀 Setup Iniziale

### 1. Verifica Dipendenze
```bash
npm install
```

### 2. Configura Environment Variables
Assicurati che `.env.local` contenga tutte le chiavi:
- ✅ Supabase (URL + Anon Key + Service Role)
- ✅ OpenAI API Key
- ✅ Anthropic API Key
- ✅ Moonshot API Key
- ✅ DeepSeek API Key

### 3. Setup Database Supabase
```bash
# 1. Vai su Supabase Dashboard
# 2. Apri SQL Editor
# 3. Copia e incolla il contenuto di supabase_schema.sql
# 4. Esegui la query
```

### 4. Abilita Autenticazione Email
1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers
2. Abilita **Email** provider
3. Salva

---

## 🧑‍💻 Test Manuale Completo

### Step 1: Avvia il Server
```bash
npm run dev
```

Apri: http://localhost:3000

### Step 2: Test Registrazione
1. Dovresti essere reindirizzato a `/login`
2. Clicca su "Registrati"
3. Compila il form:
   - Nome: Test User
   - Email: test@example.com
   - Password: password123
4. Clicca "Registrati"
5. ✅ Dovresti essere reindirizzato a `/evaluate`

### Step 3: Test Login
1. Fai logout (icona in alto a destra)
2. Torna a `/login`
3. Inserisci:
   - Email: test@example.com
   - Password: password123
4. Clicca "Accedi"
5. ✅ Dovresti essere reindirizzato a `/evaluate`

### Step 4: Test Upload Immagine
1. Nella sidebar sinistra, clicca sul box di upload
2. Seleziona un'immagine (es. un disegno, dipinto, foto)
3. ✅ L'immagine dovrebbe apparire nella preview
4. ✅ Tutti gli 8 pannelli chat dovrebbero mostrare la thumbnail

### Step 5: Test Custom Prompts
1. Trova le chat con "(Custom)" nel nome
2. Clicca sull'icona ⚙️ in alto a destra del pannello
3. Scrivi un prompt personalizzato, esempio:
   ```
   Sei un critico d'arte molto severo. Valuta quest'opera con 
   onestà brutale, senza mezzi termini.
   ```
4. ✅ Il prompt dovrebbe essere salvato nel campo textarea

### Step 6: Test Valutazione Completa
1. Con un'immagine caricata, clicca "Avvia Valutazione"
2. ✅ Tutti gli 8 pannelli dovrebbero mostrare spinner di loading
3. ✅ I pannelli si riempiono man mano che le risposte arrivano
4. ✅ Ogni pannello mostra:
   - Indicatore di stato (verde = successo)
   - Tempo di risposta (es. "2.3s")
   - Token usati (es. "1,234")
   - Risposta formattata in Markdown

### Step 7: Test Interazioni
Per ogni pannello che ha una risposta:

1. **Rating**: Clicca sulle stelle (1-5)
   - ✅ Le stelle dovrebbero riempirsi di giallo
   
2. **Copia**: Clicca l'icona Copy
   - ✅ Dovrebbe apparire un checkmark verde
   - ✅ Il testo è copiato negli appunti
   
3. **Rigenera**: Clicca l'icona Refresh
   - ✅ Il pannello dovrebbe tornare in loading
   - (Nota: funzionalità da implementare completamente)

### Step 8: Test Errori
1. **Immagine mancante**: Prova a cliccare "Avvia Valutazione" senza immagine
   - ✅ Il bottone dovrebbe essere disabilitato
   
2. **API Key mancante**: Rimuovi temporaneamente una API key dal `.env.local`
   - ✅ Il pannello corrispondente dovrebbe mostrare errore rosso

---

## 🎨 Test con Diversi Tipi di Immagini

### Test Case 1: Disegno a Matita
- Carica un disegno a matita semplice
- Verifica che le valutazioni menzionino:
  - Tecnica del tratto
  - Chiaroscuro
  - Proporzioni

### Test Case 2: Dipinto a Colori
- Carica un dipinto colorato
- Verifica che le valutazioni menzionino:
  - Uso del colore
  - Armonia cromatica
  - Composizione

### Test Case 3: Arte Digitale
- Carica un'illustrazione digitale
- Verifica che le valutazioni riconoscano:
  - Tecnica digitale
  - Stile moderno
  - Effetti digitali

### Test Case 4: Fotografia
- Carica una fotografia artistica
- Verifica che le valutazioni discutano:
  - Composizione fotografica
  - Luce e ombre
  - Soggetto

---

## 🔍 Cosa Verificare

### UI/UX
- [ ] Design dark mode corretto
- [ ] Transizioni fluide (Framer Motion)
- [ ] Responsive su diversi schermi
- [ ] Icone e colori consistenti per provider
- [ ] Scroll funziona nei pannelli

### Funzionalità
- [ ] Autenticazione funziona
- [ ] Upload immagine funziona
- [ ] Custom prompts salvati correttamente
- [ ] Valutazione parallela funziona
- [ ] Rating salvato
- [ ] Copy to clipboard funziona
- [ ] Logout funziona

### Performance
- [ ] Valutazione completa < 10 secondi
- [ ] UI rimane responsive durante valutazione
- [ ] Nessun memory leak evidente
- [ ] Immagini caricate rapidamente

### Errori Gestiti
- [ ] API key mancante → errore chiaro
- [ ] Network timeout → retry suggerito
- [ ] Immagine troppo grande → warning
- [ ] Utente non autenticato → redirect a login

---

## 🐛 Debug Comuni

### Problema: "Network Error" in tutti i pannelli
**Causa**: API keys non configurate
**Soluzione**: Verifica `.env.local`

### Problema: "401 Unauthorized" su Supabase
**Causa**: Anon Key sbagliata
**Soluzione**: Rigenera la key da Supabase Dashboard

### Problema: DeepSeek non risponde
**Causa**: Endpoint potrebbe essere cambiato
**Soluzione**: Verifica su https://platform.deepseek.com/docs

### Problema: Claude ritorna "Invalid image"
**Causa**: Formato immagine non supportato
**Soluzione**: Usa PNG, JPG, WebP

### Problema: Kimi ritorna errore cinese
**Causa**: API key cinese richiede VPN/proxy
**Soluzione**: Usa VPN o contatta Moonshot support

---

## 📊 Test di Carico (Opzionale)

### Test 10 Valutazioni Consecutive
```bash
# Carica 10 immagini diverse in rapida successione
# Verifica che:
# - Nessun crash
# - Memoria stabile
# - Tutte le risposte arrivano
```

### Test Immagini Grandi
```bash
# Carica immagine > 5MB
# Verifica compressione/warning
```

---

## ✅ Checklist Finale

Prima di considerare l'applicazione "pronta":

### Must Have
- [x] Autenticazione funzionante
- [x] Upload immagini
- [x] 8 chat parallele
- [x] Custom prompts
- [x] Rating sistema
- [ ] Salvataggio valutazioni nel DB
- [ ] History valutazioni

### Nice to Have
- [ ] Export PDF delle valutazioni
- [ ] Confronto side-by-side
- [ ] Dashboard con statistiche
- [ ] Dark/Light mode toggle
- [ ] Prompts predefiniti salvabili

---

## 🎯 Prossimi Step

1. **Implementa Salvataggio DB**
   - Usa `supabase_schema.sql`
   - Salva valutazioni complete
   - Implementa history page

2. **Migliora UX**
   - Loading states più dettagliati
   - Animazioni più fluide
   - Toast notifications

3. **Aggiungi Features**
   - Salva custom prompts preferiti
   - Confronta 2 valutazioni
   - Export in PDF/MD

4. **Deploy**
   - Vercel deployment
   - Environment variables production
   - Custom domain

---

**Buon testing! 🚀**
