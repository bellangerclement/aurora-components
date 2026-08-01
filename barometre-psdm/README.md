# Baromètre PSDM

## Installation

1. Copier le dossier dans votre dépôt GitHub Pages.
2. Vérifier que GitHub Pages est activé.
3. Ouvrir l'URL publique du dossier.
4. Intégrer cette URL dans Google Sites avec le composant d'intégration.

## Mise à jour des contenus

Les contenus se modifient dans le dossier `data/` :
- `status.json` : statut global et étapes principales ;
- `indicators.json` : chiffres clés ;
- `official-pending.json` : informations officielles / attendues ;
- `steps.json` : parcours réglementaire ;
- `timeline.json` : chronologie ;
- `news.json` : actualités ;
- `methodology.json` : méthode et sources ;
- `visitors.json` : compteur provisoire.

## Compteur de visites

Le compteur actuel lit `data/visitors.json`. Pour obtenir un compteur réel, remplacez cette lecture dans `app.js` par un appel à une API Supabase, Cloudflare Worker, Railway ou autre backend.

## Responsive

Le composant est conçu mobile-first :
- 1 colonne sur mobile ;
- 2 colonnes sur tablette ;
- jusqu'à 4 colonnes sur ordinateur ;
- aucune table horizontale ;
- frise verticale sur tous les formats.
