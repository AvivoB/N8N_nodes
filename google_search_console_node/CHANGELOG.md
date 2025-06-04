# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

## [1.0.0] - 2025-06-04

### Ajouté
- Nœud Google Search Console initial avec support complet de l'API
- **Gestion des Sites** :
  - Lister tous les sites Search Console
  - Obtenir des informations sur un site spécifique
  - Ajouter un nouveau site
  - Supprimer un site
- **Search Analytics** :
  - Interroger les données de trafic de recherche
  - Support de toutes les dimensions (query, page, country, device, date, searchAppearance)
  - Filtres avancés avec opérateurs (contains, equals, regex, etc.)
  - Support de tous les types de recherche (web, image, video, news)
  - Pagination et limitation des résultats
  - Agrégation configurable
- **Gestion des Sitemaps** :
  - Lister tous les sitemaps d'un site
  - Obtenir des informations détaillées sur un sitemap
  - Soumettre un nouveau sitemap
  - Supprimer un sitemap
- **Inspection d'URL** :
  - Inspecter l'état d'indexation d'une URL
  - Support multilingue
  - Informations détaillées sur l'exploration et l'indexation
- **Authentification OAuth2** :
  - Support complet OAuth2 Google
  - Gestion automatique des tokens
  - Scopes appropriés (webmasters et webmasters.readonly)
- **Gestion d'erreurs robuste** :
  - Messages d'erreur détaillés
  - Gestion des codes d'erreur HTTP spécifiques
  - Support du mode "Continue on Fail"
- **Documentation complète** :
  - Guide d'installation et de configuration
  - Exemples d'utilisation
  - Guide de test
  - Guide de déploiement

### Technique
- **Architecture modulaire** avec GenericFunctions
- **Validation des données** d'entrée
- **Support TypeScript** complet
- **Tests ESLint** conformes aux standards N8N
- **Build automatisé** avec copie des assets
- **Support des formats de date** ISO et YYYY-MM-DD
- **Formatage automatique** des URLs de site
- **Helper functions** pour la construction des requêtes

### Compatibilité
- **N8N** : Version communautaire compatible
- **Node.js** : >= 18.10
- **Google Search Console API** : v3
- **Google URL Inspection API** : v1

## [Unreleased]

### Prévu
- Support des métriques personnalisées
- Export des données en différents formats
- Intégration avec Google Analytics 4
- Support des annotations Search Console
- Cache des données pour optimiser les quotas
- Webhooks pour les notifications Search Console
