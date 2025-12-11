# Order Management System

A full-stack order management application built with Spring Boot and React.

![alt text](https://github.com/andreeeeeea/OrderManagement/blob/main/dashboard.png?raw=true)


## Tech Stack

- **Backend:** Spring Boot, PostgreSQL, RabbitMQ
- **Frontend:** React, TypeScript, Tailwind CSS
- **Infrastructure:** Docker

## Quick Start

```bash
# Start PostgreSQL and RabbitMQ
docker compose up -d

# Run backend (localhost:8080)
./mvnw spring-boot:run

# Run frontend (localhost:5173)
cd frontend
npm install
npm run dev
```

## Features

- Product catalog with cart functionality
- Order creation and status management
- Dashboard with order statistics
- Async messaging with RabbitMQ
