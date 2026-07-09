# Node.js Microservice Project

A microservice architecture built with Node.js, featuring user management, task management, and notification services. This project demonstrates containerized microservices using Docker Compose, with MongoDB for data persistence and RabbitMQ for message queuing.

## Architecture

The project consists of four main services:

-   **User Service** (Port 3001): Handles user management operations
-   **Task Service** (Port 3002): Manages task creation and operations
-   **Notification Service** (Port 3003): Processes notifications via message queue
-   **MongoDB** (Port 27017): Database for data persistence
-   **RabbitMQ** (Ports 5672, 15672): Message broker for inter-service communication

## Prerequisites

-   Docker and Docker Compose installed on your system
-   Node.js (for local development, optional)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd nodejs-microservice
    ```

2. Ensure Docker and Docker Compose are running

## Running the Application

### Start all services:

```bash
docker compose up --build -d
```

### Stop all services:

```bash
docker compose down
```

### View logs:

```bash
docker compose logs -f
```

### Access services:

-   User Service: http://localhost:3001
-   Task Service: http://localhost:3002
-   Notification Service: http://localhost:3003
-   RabbitMQ Management UI: http://localhost:15672 (guest/guest)

## Services Overview

### User Service

-   **Port**: 3001
-   **Dependencies**: MongoDB
-   **Endpoints**:
    -   `GET /users` - Retrieve all users
    -   `POST /users` - Create a new user

### Task Service

-   **Port**: 3002
-   **Dependencies**: MongoDB, RabbitMQ
-   **Features**: Task management with notification integration

### Notification Service

-   **Port**: 3003
-   **Dependencies**: RabbitMQ, MongoDB
-   **Features**: Processes notifications from the message queue (no HTTP endpoints)

## API Testing with cURL

Once all services are running, you can test the APIs using the following cURL commands:

### User Service (Port 3001)

**Get all users:**

```bash
curl -X GET http://localhost:3001/users
```

**Create a new user:**

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

**Delete all users:**

```bash
curl -X DELETE http://localhost:3001/users/all
```

### Task Service (Port 3002)

**Get all tasks:**

```bash
curl -X GET http://localhost:3002/tasks
```

**Create a new task:**

```bash
curl -X POST http://localhost:3002/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Task", "description": "This is a test task", "userId": "user123"}'
```

**Delete all tasks:**

```bash
curl -X DELETE http://localhost:3002/tasks/all
```

### Example Workflow

1. **Create a user:**

    ```bash
    curl -X POST http://localhost:3001/users \
      -H "Content-Type: application/json" \
      -d '{"name": "Alice Smith", "email": "alice@example.com"}'
    ```

2. **Create a task for that user:**

    ```bash
    curl -X POST http://localhost:3002/tasks \
      -H "Content-Type: application/json" \
      -d '{"title": "Complete project", "description": "Finish the microservice project", "userId": "user_id_from_step_1"}'
    ```

3. **Check that the task was created:**

    ```bash
    curl -X GET http://localhost:3002/tasks
    ```

4. **Check the notification service logs** (the notification service will log the task creation):
    ```bash
    docker compose logs notification-service
    ```

## Docker Commands

### Basic Commands

-   Check Docker version: `docker --version`
-   Start services in detached mode: `docker compose up -d`
-   Stop and remove containers: `docker compose down`
-   Build and start services: `docker compose up --build -d`

### Volume Management

-   List all volumes: `docker volume ls`
-   Remove a specific volume: `docker volume rm volume-name`

### Container Management

-   List running containers: `docker ps`
-   List all containers: `docker ps -a`
-   Stop a specific container: `docker stop <container-name>`
-   Remove a container: `docker rm <container-name>`

### Logs and Debugging

-   View logs for all services: `docker compose logs`
-   Follow logs in real-time: `docker compose logs -f`
-   View logs for specific service: `docker compose logs <service-name>`

## Development

For local development without Docker:

1. Start MongoDB and RabbitMQ services via Docker:

    ```bash
    docker compose up mongo rabbitmq -d
    ```

2. Install dependencies for each service:

    ```bash
    cd user-service && npm install
    cd ../task-service && npm install
    cd ../notification-service && npm install
    ```

3. Run services locally:

    ```bash
    # Terminal 1 - User Service
    cd user-service && npm run dev

    # Terminal 2 - Task Service
    cd task-service && npm run dev

    # Terminal 3 - Notification Service
    cd notification-service && npm run dev
    ```

## Project Structure

```
nodejs-microservice/
├── docker-compose.yml
├── readme.md
├── user-service/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── task-service/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
└── notification-service/
    ├── Dockerfile
    ├── index.js
    └── package.json
```

## Technologies Used

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MongoDB** - NoSQL database
-   **Mongoose** - MongoDB object modeling
-   **RabbitMQ** - Message broker
-   **Docker** - Containerization
-   **Docker Compose** - Multi-container orchestration
