# PassGankpo — Générateur de mots de passe

Construit avec Next.js 14, TypeScript et Tailwind CSS.

## Ce qu'il fait

- Génération via `crypto.getRandomValues` — pas `Math.random`, qui n'est pas aléatoire au sens cryptographique
- Calcul d'entropie en bits pour estimer la robustesse réelle du mot de passe
- Options configurables : longueur, majuscules, minuscules, chiffres, symboles
- Option pour exclure les caractères ambigus (I, l, 1, O, 0) — utile quand le mot de passe sera recopié à la main
- Génération et copie de N mots de passe d'un coup
- Historique des 10 derniers générés
- Copie en un clic
- Interface sombre

## Démarrage

Node.js 18+ requis.

cd password-generator
npm install
npm run dev

Ouvrir http://localhost:3000

En production : https://soso-password.vercel.app

## Sécurité

`crypto.getRandomValues()` tire son entropie du système d'exploitation, pas d'un algorithme mathématique déterministe. `Math.random()` est rapide et pratique — mais prévisible. Pour des mots de passe, ça compte.
