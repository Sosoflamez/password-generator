# 🔐 PassGankpo — Générateur de mots de passe

Un générateur de mots de passe sécurisé construit avec **Next.js 14**, **TypeScript** et **Tailwind CSS**.

## Fonctionnalités

- **Génération cryptographique** via `crypto.getRandomValues` (pas `Math.random` !)
- **Indicateur de robustesse** avec calcul d'entropie en bits
- **Options personnalisables** : longueur, majuscules, minuscules, chiffres, symboles
- **Exclure les caractères ambigus** (I, l, 1, O, 0)
- **Génération multiple** : générer et copier N mots de passe d'un coup
- **Historique** des 10 derniers mots de passe générés
- **Copie en un clic** dans le presse-papiers
- Interface sombre et design moderne

## Démarrage rapide

### Prérequis
- Node.js 18+ installé sur votre machine
- npm (inclus avec Node.js)

### Installation

```bash
# 1. Aller dans le dossier du projet
cd password-generator

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Production

```bash
# Construire l'application
npm run build

# Démarrer en production
npm start
```

## 🔒 Sécurité

Les mots de passe sont générés avec `crypto.getRandomValues()` (API Web Crypto), 
qui utilise une source d'entropie cryptographiquement sûre, contrairement à `Math.random()`.

Tout se passe **localement dans votre navigateur** — aucune donnée n'est envoyée vers un serveur.
