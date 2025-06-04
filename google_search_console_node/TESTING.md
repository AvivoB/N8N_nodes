# Test du nœud Google Search Console

Ce document contient des exemples de test pour valider le fonctionnement du nœud Google Search Console.

## Prérequis

1. Avoir configuré les credentials OAuth2 Google Search Console
2. Avoir au moins un site vérifié dans Google Search Console
3. Avoir N8N en cours d'exécution

## Tests de base

### 1. Test de connexion - Lister tous les sites

**Configuration du nœud :**
```json
{
  "resource": "site",
  "operation": "getAll"
}
```

**Résultat attendu :**
```json
{
  "siteEntry": [
    {
      "siteUrl": "https://votre-site.com/",
      "permissionLevel": "siteOwner"
    }
  ]
}
```

### 2. Test Search Analytics - Top mots-clés

**Configuration du nœud :**
```json
{
  "resource": "searchAnalytics",
  "operation": "query",
  "siteUrl": "https://votre-site.com/",
  "startDate": "2025-05-01T00:00:00.000Z",
  "endDate": "2025-05-31T23:59:59.999Z",
  "dimensions": ["query"],
  "additionalFields": {
    "rowLimit": 50,
    "searchType": "web"
  }
}
```

**Résultat attendu :**
```json
{
  "rows": [
    {
      "keys": ["votre mot-clé"],
      "clicks": 25,
      "impressions": 450,
      "ctr": 0.055555555555555556,
      "position": 12.4
    }
  ]
}
```

### 3. Test Search Analytics avec filtres

**Configuration du nœud :**
```json
{
  "resource": "searchAnalytics",
  "operation": "query",
  "siteUrl": "https://votre-site.com/",
  "startDate": "2025-05-01T00:00:00.000Z",
  "endDate": "2025-05-31T23:59:59.999Z",
  "dimensions": ["page", "query"],
  "additionalFields": {
    "rowLimit": 20,
    "dimensionFilterGroups": [
      {
        "groupType": "and",
        "filters": [
          {
            "dimension": "query",
            "operator": "contains",
            "expression": "SEO"
          }
        ]
      }
    ]
  }
}
```

### 4. Test Sitemaps - Lister les sitemaps

**Configuration du nœud :**
```json
{
  "resource": "sitemap",
  "operation": "getAll",
  "siteUrl": "https://votre-site.com/"
}
```

**Résultat attendu :**
```json
{
  "sitemap": [
    {
      "path": "https://votre-site.com/sitemap.xml",
      "lastSubmitted": "2025-05-15T10:30:00.000Z",
      "isPending": false,
      "isSitemapsIndex": false,
      "type": "WEB",
      "lastDownloaded": "2025-05-15T10:31:00.000Z",
      "warnings": 0,
      "errors": 0
    }
  ]
}
```

### 5. Test URL Inspection

**Configuration du nœud :**
```json
{
  "resource": "urlInspection",
  "operation": "inspect",
  "siteUrl": "https://votre-site.com/",
  "inspectionUrl": "https://votre-site.com/page-importante",
  "languageCode": "fr-FR"
}
```

## Tests d'erreurs

### 1. Site non autorisé
- Utiliser une URL de site non ajoutée à Search Console
- Devrait retourner une erreur 404

### 2. Dates invalides
- Utiliser des dates dans le futur ou un format incorrect
- Devrait retourner une erreur 400

### 3. Quota dépassé
- Faire trop de requêtes en peu de temps
- Devrait retourner une erreur 429

## Workflow d'exemple complet

```json
{
  "name": "Analyse SEO automatique",
  "nodes": [
    {
      "name": "Trigger quotidien",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "hour": 8,
          "minute": 0
        }
      }
    },
    {
      "name": "Récupérer sites",
      "type": "n8n-nodes-google-search-console.googleSearchConsole",
      "parameters": {
        "resource": "site",
        "operation": "getAll"
      }
    },
    {
      "name": "Analyser performances",
      "type": "n8n-nodes-google-search-console.googleSearchConsole",
      "parameters": {
        "resource": "searchAnalytics",
        "operation": "query",
        "siteUrl": "={{ $json.siteEntry[0].siteUrl }}",
        "startDate": "={{ $now.minus({days: 30}).toISODate() }}",
        "endDate": "={{ $now.minus({days: 1}).toISODate() }}",
        "dimensions": ["query", "page"],
        "additionalFields": {
          "rowLimit": 100
        }
      }
    },
    {
      "name": "Envoyer rapport",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "subject": "Rapport SEO quotidien",
        "message": "Top 10 mots-clés : {{ $json.rows.slice(0,10) }}"
      }
    }
  ]
}
```

## Conseils de débogage

1. **Vérifiez les credentials** : Assurez-vous que l'OAuth2 fonctionne
2. **Testez avec des données récentes** : Les données Search Console ont 2-3 jours de retard
3. **Respectez les quotas** : Ne pas faire trop de requêtes simultanées
4. **Utilisez continue on fail** : Pour gérer les erreurs gracieusement
5. **Vérifiez les URLs** : Les URLs doivent être exactement comme dans Search Console
