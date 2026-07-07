# FORJA — app de treino (hipertrofia)

App React/Vite standalone. Os dados ficam no **localStorage** do dispositivo — sem backend, sem login. Cada celular/navegador guarda o próprio histórico.

## Rodar local

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Subir no Vercel

### Rota A — GitHub + Vercel (recomendada)
1. Crie um repositório no GitHub e suba esta pasta:
   ```bash
   git init
   git add .
   git commit -m "FORJA v1"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/forja.git
   git push -u origin main
   ```
2. Em https://vercel.com → **Add New → Project** → importe o repositório.
3. O Vercel detecta Vite sozinho. Confirme:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**. Cada `git push` na main faz redeploy automático.

### Rota B — Vercel CLI (sem GitHub)
```bash
npm i -g vercel
vercel        # primeira vez: responde as perguntas, aceita os padrões do Vite
vercel --prod # publica em produção
```

### Rota C — sem build (arrastar e soltar)
```bash
npm install
npm run build   # gera a pasta dist/
```
Depois, em https://vercel.com, arraste a pasta **dist** na área de deploy. É um site estático puro.

## Instalar como app no celular (PWA)
Depois de online, abra a URL no celular:
- **Android/Chrome:** menu → "Adicionar à tela inicial".
- **iPhone/Safari:** compartilhar → "Adicionar à Tela de Início".

Abre em tela cheia, com ícone próprio.

> Para PWA offline completa (service worker + cache), adicione `vite-plugin-pwa` depois. O manifest já está incluído para a instalação funcionar.

## Backup dos dados
Como o histórico vive no navegador, trocar de aparelho ou limpar dados apaga tudo. Se quiser sincronização entre dispositivos, dá pra trocar a camada de storage por Upstash Redis + uma serverless function em `/api` (mesmo padrão do Jaleco).
