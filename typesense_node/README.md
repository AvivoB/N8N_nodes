# N8N Typesense Node

Un nœud communautaire N8N pour intégrer Typesense, un moteur de recherche rapide et tolérant aux fautes de frappe.

## Installation

### Installation via npm

```bash
npm install n8n-nodes-typesense
```

### Installation manuelle

1. Clonez ce repository
2. Installez les dépendances : `npm install`
3. Construisez le projet : `npm run build`
4. Liez le package : `npm link`
5. Dans votre installation N8N : `npm link n8n-nodes-typesense`

## Configuration

### Identifiants Typesense

Avant d'utiliser le nœud, vous devez configurer vos identifiants Typesense :

1. Dans N8N, allez dans **Credentials** > **New**
2. Recherchez "Typesense API"
3. Configurez les paramètres suivants :
   - **Host** : L'adresse de votre serveur Typesense (ex: `localhost`, `search.example.com`)
   - **Port** : Le port de votre serveur Typesense (défaut: `8108`)
   - **Protocol** : `http` ou `https`
   - **API Key** : Votre clé API Typesense

## Fonctionnalités

### Collections

- **Create** : Créer une nouvelle collection avec un schéma défini
- **Get** : Récupérer les détails d'une collection
- **List** : Lister toutes les collections
- **Update** : Mettre à jour le schéma d'une collection
- **Delete** : Supprimer une collection

### Documents

- **Create** : Ajouter un nouveau document à une collection
- **Get** : Récupérer un document par son ID
- **Update** : Mettre à jour un document existant
- **Upsert** : Créer ou mettre à jour un document
- **Delete** : Supprimer un document

### Recherche

- **Search** : Effectuer une recherche dans une collection
- **Multi Search** : Effectuer plusieurs recherches en parallèle

## Exemples d'utilisation

### 1. Créer une collection

```json
{
  "name": "products",
  "fields": [
    {"name": "name", "type": "string"},
    {"name": "price", "type": "float"},
    {"name": "category", "type": "string", "facet": true},
    {"name": "description", "type": "string"},
    {"name": "rating", "type": "float"}
  ],
  "default_sorting_field": "rating"
}
```

### 2. Ajouter un document

```json
{
  "id": "1",
  "name": "iPhone 14",
  "price": 999.99,
  "category": "Electronics",
  "description": "Latest Apple smartphone",
  "rating": 4.5
}
```

### 3. Effectuer une recherche

**Paramètres de recherche :**
- **Query** : `iPhone`
- **Query By** : `name,description`
- **Filter By** : `category:=Electronics && price:<1000`
- **Sort By** : `rating:desc`

## Schéma de collection

Les collections Typesense nécessitent un schéma défini. Voici les types de champs supportés :

- `string` : Texte
- `int32`, `int64` : Entiers
- `float` : Nombres décimaux
- `bool` : Booléens
- `string[]` : Tableau de chaînes
- `int32[]`, `int64[]`, `float[]` : Tableaux de nombres

### Propriétés des champs

- `facet` : Permet le filtrage par facettes
- `index` : Indexe le champ pour la recherche (défaut: true)
- `optional` : Le champ est optionnel
- `sort` : Permet le tri par ce champ

## Recherche avancée

### Filtres

Utilisez la syntaxe de filtrage Typesense :

- Égalité : `category:=Electronics`
- Inégalité : `price:>100`
- Plage : `rating:[4..5]`
- Opérateurs : `&&` (ET), `||` (OU)
- Négation : `NOT category:=Books`

### Tri

Format : `field:direction`
- `price:asc` : Prix croissant
- `rating:desc` : Note décroissante
- `_text_match:desc` : Pertinence décroissante

### Facettes

Ajoutez `facet_by` pour obtenir des comptages par catégorie :
- `category,brand` : Facettes par catégorie et marque

## Développement

### Structure du projet

```
src/
├── credentials/
│   └── TypesenseApi.credentials.ts
├── nodes/
│   └── Typesense/
│       ├── GenericFunctions.ts
│       ├── Typesense.node.ts
│       └── typesense.svg
└── index.ts
```

### Scripts disponibles

- `npm run build` : Compile TypeScript
- `npm run dev` : Mode développement avec watch
- `npm run lint` : Vérifie le code avec ESLint
- `npm run lint:fix` : Corrige automatiquement les erreurs ESLint

## Support

- [Documentation Typesense](https://typesense.org/docs/)
- [Documentation N8N](https://docs.n8n.io/)
- [Communauté N8N](https://community.n8n.io/)

## Licence

MIT

## Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Changelog

### v1.0.0
- Implémentation initiale
- Support des collections, documents et recherche
- Interface utilisateur complète
- Gestion d'erreurs robuste
