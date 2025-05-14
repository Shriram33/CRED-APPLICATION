# CRED APPLICATION

**Folder Structure**




```
3-tier-app/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   └── index.html
├── docker-compose.yml
```

**If you are not using any cloud service provder then you can use docker compose file ```docker-compose.yml```**

```
version: '3'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: customers
    ports:
      - "5432:5432"

```


**After starting the containers, connect to the PostgreSQL container and run:**
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  dob DATE NOT NULL
);
```
***For health chaeck of backend servers run```http://<public-ip>:3000/health```***
