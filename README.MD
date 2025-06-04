# n8n Custom Modules

## How to use ?
For use this custom modules in your n8n instance, use this docker compose, set permission for the volume for ensure your container has access to your custom modules

```yaml
services:
    n8n:
      image: n8nio/n8n
      restart: unless-stopped
      ports:
        - "5678:5678"
      environment:
        - N8N_HOST="your-domaine-orsubdomain.fr"
        - WEBHOOK_TUNNEL_URL="https://your-domaine-orsubdomain.fr/"
        - WEBHOOK_URL="https://your-domaine-orsubdomain.fr/"
        - N8N_PUSH_BACKEND=sse
        - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
        - N8N_CUSTOM_EXTENSIONS=/custom_nodes
        - N8N_RUNNERS_ENABLED=true
      volumes:
        - ./n8n_data:/home/node/.n8n
        - ./n8n_data/custom_nodes:/custom_nodes
volumes:
  n8n_data:
```
clone this repository on n8n_data/custom_nodes


```bash
docker compose up --build
```

## Modules Available
### Google Search Console
- Search Analytics
- Sitemaps
- All sites
- Inspect URL

### Typesense
- Create, Delete, Update collections
- Create, Delete, Update documents
- Search with query and query advanced in Typesense docs

