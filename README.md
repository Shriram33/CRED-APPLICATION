# CRED APPLICATION
### Folder Structure


3-tier-app/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   └── index.html
├── docker-compose.yml



### After starting the containers, connect to the PostgreSQL container and run:
```
CREATE TABLE names (
id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);
```
