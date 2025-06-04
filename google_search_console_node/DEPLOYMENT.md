# Guide de déploiement et d'installation

## Déploiement du nœud Google Search Console

### 1. Installation en local (développement)

```cmd
cd c:\Users\Aviel\Documents\N8N_nodes\google_search_console_node
npm run build
npm link
```

Puis dans votre installation N8N :
```cmd
cd chemin\vers\n8n
npm link n8n-nodes-google-search-console
```

### 2. Installation via NPM (production)

Si vous publiez sur NPM :
```cmd
npm publish
```

Puis dans N8N :
- Aller dans **Settings > Community Nodes**
- Installer : `n8n-nodes-google-search-console`

### 3. Installation manuelle

1. Copier le dossier `dist/` dans votre installation N8N
2. Ajouter le nœud dans la configuration N8N

## Configuration Google Cloud Console

### 1. Créer un projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Noter l'ID du projet

### 2. Activer l'API Search Console

1. Dans le menu de navigation, aller à **APIs & Services > Library**
2. Rechercher "Search Console API"
3. Cliquer sur "Google Search Console API"
4. Cliquer sur **Enable**

### 3. Créer les credentials OAuth2

1. Aller à **APIs & Services > Credentials**
2. Cliquer sur **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. Configurer l'écran de consentement si nécessaire :
   - Type d'application : External
   - Nom de l'application : "N8N Google Search Console"
   - Email de contact : votre email
   - Domaines autorisés : `localhost` (pour le développement)
4. Créer les credentials OAuth2 :
   - Type d'application : **Web application**
   - Nom : "N8N Google Search Console"
   - URLs de redirection autorisées :
     - `http://localhost:5678/rest/oauth2-credential/callback`
     - `https://votre-n8n-domain.com/rest/oauth2-credential/callback` (pour la production)
5. Copier le **Client ID** et **Client Secret**

### 4. Configuration dans N8N

1. Dans N8N, aller à **Settings > Credentials**
2. Cliquer sur **Add credential**
3. Sélectionner **Google Search Console OAuth2 API**
4. Remplir les champs :
   - **Client ID** : Votre Client ID Google
   - **Client Secret** : Votre Client Secret Google
5. Cliquer sur **Connect my account**
6. Autoriser l'accès dans la popup Google
7. Tester la connexion

## Scopes d'autorisation

Le nœud demande les scopes suivants :
- `https://www.googleapis.com/auth/webmasters` : Accès complet (lecture/écriture)
- `https://www.googleapis.com/auth/webmasters.readonly` : Accès en lecture seule

## Vérification de l'installation

### Test rapide

1. Créer un nouveau workflow
2. Ajouter le nœud **Google Search Console**
3. Configurer :
   - **Resource** : Site
   - **Operation** : Get All
4. Exécuter le workflow
5. Vérifier que la liste de vos sites s'affiche

### Test complet

Utiliser les exemples dans `TESTING.md` pour valider toutes les fonctionnalités.

## Dépannage

### Erreur d'authentification
- Vérifier que les credentials OAuth2 sont corrects
- Vérifier que l'API Search Console est activée
- Vérifier les URLs de redirection

### Erreur 403 (Forbidden)
- Vérifier que vous avez accès au site dans Search Console
- Vérifier les scopes d'autorisation
- Vérifier les quotas de l'API

### Erreur 404 (Not Found)
- Vérifier que l'URL du site est exacte
- Vérifier que le site est ajouté dans Search Console
- Vérifier que l'URL inclut le protocole (https://)

### Pas de données
- Les données Search Console ont 2-3 jours de retard
- Vérifier la plage de dates
- Vérifier que le site a du trafic

## Limites et quotas

- **Requêtes par jour** : 200,000 par projet Google Cloud
- **Requêtes par 100 secondes** : 1,200
- **Lignes par requête Search Analytics** : 25,000 maximum
- **Historique des données** : 16 mois maximum

## Support

- [Documentation Google Search Console API](https://developers.google.com/webmaster-tools)
- [Documentation N8N Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Forum N8N](https://community.n8n.io/)
