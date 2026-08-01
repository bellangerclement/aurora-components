# Baromètre PSDM Premium

## Installation
1. Décompresser le dossier.
2. Copier son contenu dans `barometre-psdm/` sur GitHub.
3. Conserver exactement les sous-dossiers `components`, `css`, `js` et `data`.
4. Ouvrir l’URL GitHub Pages correspondant au dossier.
5. Intégrer cette URL dans Google Sites.

## Mise à jour
Modifier principalement les fichiers JSON dans `data/`.

## Test local
Le chargement des composants utilise `fetch()`. Pour tester en local :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/barometre-psdm-premium/`.

## Responsive
La page est mobile-first, sans tableau horizontal, avec frise verticale et animations respectant `prefers-reduced-motion`.
