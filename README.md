# Erika Masotti

Sito statico in italiano realizzato con **Astro 5 e Tailwind CSS 4**, destinato a GitHub Pages. Non richiede database, server applicativi, React o credenziali nel codice. Non incorpora analytics, font caricati da servizi remoti o widget esterni; email, telefono e WhatsApp si aprono solo quando il visitatore seleziona il relativo collegamento.

## Aggiornare il sito senza terminale

Dal repository su GitHub, apri il file desiderato, seleziona la matita **Edit**, modifica il testo e salva con **Commit changes**:

| Cosa aggiornare | File |
| --- | --- |
| Nome, contatti, indirizzo e social | [src/content/site.json](src/content/site.json) |
| Testi e servizi della Home | [src/content/home.json](src/content/home.json) |
| Presentazione e formazione | [src/content/pages/about.md](src/content/pages/about.md) |
| Servizi, progetti, sedi e orari | [src/content/pages/services.md](src/content/pages/services.md) |
| Testo della pagina contatti | [src/content/pages/contacts.md](src/content/pages/contacts.md) |
| Inquadrature degli sfondi hero (desktop e telefono) | [src/content/hero-images.json](src/content/hero-images.json) |
| Fotografie | [src/assets/photos](src/assets/photos) |

Nei file `.md` scrivi normale testo: `##` introduce un titolo, `**testo**` indica il grassetto e `-` introduce un elemento di elenco. Conserva le informazioni tra le prime due righe `---` e l’identificatore `id="percorso"` nella pagina servizi.

Nei file JSON conserva virgolette, parentesi e virgole. I controlli della compilazione segnalano gli errori di sintassi. Le fotografie originali sono in `src/assets/photos/`: Astro genera WebP a più risoluzioni, con una larghezza massima di 3200 pixel e senza ingrandire gli originali. Per cambiare una foto, carica un’immagine con lo stesso nome e controlla che la descrizione alternativa nel componente continui a descriverla correttamente. Le nuove immagini devono essere adatte alla pubblicazione e il testo alternativo deve rispecchiarne il contenuto.

Le informazioni pubblicate, inclusi email e telefono, sono pubbliche. Password e chiavi private non devono mai essere inserite nel repository.

## Pubblicazione

Dominio di produzione: **https://erikamasotti.it/**. Il file `public/CNAME` viene copiato nella radice di `dist/` e conserva il dominio nella pubblicazione dal ramo `gh-pages`.

La procedura in `.github/workflows/deploy.yml` verifica e genera il sito a ogni modifica su `main`, poi pubblica `dist/`. Per attivarla, seleziona **Settings → Pages → Source → GitHub Actions**. L’account che carica la procedura deve essere autorizzato anche a scrivere workflow. Non occorrono secret aggiuntivi: viene usato il `GITHUB_TOKEN` temporaneo fornito da GitHub Actions.

Il primo test può essere pubblicato anche dal ramo `gh-pages`, contenente solo i file generati. In questo caso **le modifiche a `main` non aggiornano automaticamente il sito** finché non viene attivata la procedura GitHub Actions.

GitHub Pages deve avere `erikamasotti.it` come dominio personalizzato. Su Aruba, i record A del dominio devono puntare a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; il CNAME `www` deve puntare a `alexalbertini88.github.io`. Conservare i record della posta. Dopo la propagazione del DNS, verificare la disponibilità del certificato e attivare Enforce HTTPS in Settings → Pages. La procedura GitHub Actions, quando attivata, legge il percorso corretto da Pages.

## Sviluppo

Richiede Node.js 22.12+.

```bash
npm ci
npm run dev
```

Apri l’indirizzo stampato da Astro. Per ricompilare per il vecchio indirizzo di prova usa `SITE_URL=https://alexalbertini88.github.io BASE_PATH=/erikamasotti npm run build` e rimuovi `dist/CNAME` solo da quella pubblicazione alternativa. Un indirizzo `localhost` di un ambiente cloud è raggiungibile soltanto tramite il browser dello stesso ambiente o un inoltro porte supportato; non è un’anteprima pubblica.

```bash
npm run check
npm run build
```

Per compilare per un dominio diverso puoi passare `SITE_URL` e `BASE_PATH`. Per la radice di un dominio usa `BASE_PATH=/`. Sono impostazioni pubbliche di compilazione, non credenziali.

## Accessibilità

La struttura include lingua italiana, landmark, titoli gerarchici, testo alternativo, un collegamento per saltare la navigazione e focus visibile. Il menu mobile usa `details`/`summary` nativi e funziona senza JavaScript. Le animazioni rispettano `prefers-reduced-motion`; i font Fira Sans e Fira Sans Extra Condensed sono ospitati nel sito (licenze OFL in `public/fonts/`). I testi sulle fotografie sono protetti da una copertura nera al 62%, che mantiene il contrasto anche sulle aree più chiare. Lo sfondo lilla e la composizione fotografica riprendono il sito originale.

I colori testuali principali hanno contrasto superiore a 4,5:1. Questo controllo dei colori e la compilazione non costituiscono una certificazione WCAG: restano da verificare nel browser zoom, navigazione da tastiera, lettori di schermo e impaginazione a diverse larghezze.
