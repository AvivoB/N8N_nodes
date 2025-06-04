# N8N Google Search Console Node

Ce nœud communautaire N8N vous permet d'interagir avec l'API Google Search Console pour récupérer des données SEO, gérer des sites, analyser les sitemaps et inspecter des URLs.

## Installation

1. Dans N8N, allez dans **Settings > Community Nodes**
2. Installez le package : `n8n-nodes-google-search-console`

## Configuration

### 1. Créer les credentials OAuth2

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API **Search Console API**
4. Créez des credentials OAuth 2.0 :
   - Type d'application : Application Web
   - URLs de redirection autorisées : `http://localhost:5678/rest/oauth2-credential/callback`
5. Copiez le Client ID et Client Secret
6. Dans N8N, créez de nouveaux credentials "Google Search Console OAuth2 API"
7. Renseignez le Client ID et Client Secret

### 2. Autoriser l'accès

1. Testez la connexion dans N8N
2. Autorisez l'accès à vos données Search Console
3. Les scopes suivants sont automatiquement demandés :
   - `https://www.googleapis.com/auth/webmasters.readonly` (lecture)
   - `https://www.googleapis.com/auth/webmasters` (lecture/écriture)

## Fonctionnalités

### 📊 Sites
- **Get All** : Lister tous vos sites Search Console
- **Get** : Obtenir des informations sur un site spécifique
- **Add** : Ajouter un nouveau site à Search Console
- **Delete** : Supprimer un site de Search Console

### 📈 Search Analytics
- **Query** : Interroger les données de trafic de recherche
  - Filtres par mots-clés, pages, pays, appareils
  - Dimensions configurables (requête, page, pays, appareil, date)
  - Types de recherche (web, images, vidéos, actualités)
  - Filtres avancés avec opérateurs (contient, égal, regex, etc.)
  - Pagination et limitation des résultats

### 🗺️ Sitemaps
- **Get All** : Lister tous les sitemaps d'un site
- **Get** : Obtenir des informations sur un sitemap spécifique
- **Submit** : Soumettre un nouveau sitemap à Google
- **Delete** : Supprimer un sitemap

### 🔍 URL Inspection
- **Inspect** : Obtenir des informations détaillées sur l'indexation d'une URL
  - État d'indexation Google
  - Problèmes d'exploration
  - Données de rendu
  - Support multilingue

## Exemples d'utilisation

### 1. Récupérer les top mots-clés

```json
{
  "resource": "searchAnalytics",
  "operation": "query",
  "siteUrl": "https://monsite.com/",
  "startDate": "2025-05-01",
  "endDate": "2025-05-31",
  "dimensions": ["query"],
  "additionalFields": {
    "rowLimit": 100,
    "searchType": "web"
  }
}
```

### 2. Analyser les performances par page

```json
{
  "resource": "searchAnalytics",
  "operation": "query",
  "siteUrl": "https://monsite.com/",
  "startDate": "2025-05-01",
  "endDate": "2025-05-31",
  "dimensions": ["page", "query"],
  "additionalFields": {
    "rowLimit": 50,
    "dimensionFilterGroups": [{
      "groupType": "and",
      "filters": [{
        "dimension": "page",
        "operator": "contains",
        "expression": "/blog/"
      }]
    }]
  }
}
```

### 3. Vérifier l'état d'indexation d'une URL

```json
{
  "resource": "urlInspection",
  "operation": "inspect",
  "siteUrl": "https://monsite.com/",
  "inspectionUrl": "https://monsite.com/page-importante",
  "languageCode": "fr-FR"
}
```

### 4. Soumettre un sitemap

```json
{
  "resource": "sitemap",
  "operation": "submit",
  "siteUrl": "https://monsite.com/",
  "sitemapUrl": "https://monsite.com/sitemap.xml"
}
```

## Données retournées

### Search Analytics
```json
{
  "rows": [
    {
      "keys": ["mot-clé"],
      "clicks": 150,
      "impressions": 2500,
      "ctr": 0.06,
      "position": 8.5
    }
  ]
}
```

### URL Inspection
```json
{
  "inspectionResult": {
    "indexStatusResult": {
      "verdict": "PASS",
      "coverageState": "Submitted and indexed"
    },
    "urlIsIndexed": true,
    "lastCrawlTime": "2025-05-15T10:30:00Z"
  }
}
```

## Limites de l'API

- **Search Analytics** : 25,000 lignes par requête maximum
- **Quota quotidien** : Selon les limites Google Cloud Console
- **Historique des données** : 16 mois maximum
- **Délai des données** : 2-3 jours de latence

## Gestion des erreurs

Le nœud gère automatiquement les erreurs courantes :
- **401** : Problème d'authentification OAuth2
- **403** : Permissions insuffisantes ou quota dépassé
- **404** : Site ou ressource non trouvé
- **429** : Limite de taux dépassée

## Support

Pour signaler des problèmes ou demander des fonctionnalités :
- Créez une issue sur le repository GitHub
- Consultez la documentation officielle [Google Search Console API](https://developers.google.com/webmaster-tools)

## Changelog

### v1.0.0
- Version initiale avec support complet de l'API Search Console
- Support OAuth2
- Gestion des sites, analytics, sitemaps et inspection d'URLs
