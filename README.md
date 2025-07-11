# Node.js Multi-Tenant Schema

This project is a Node.js application that implements a multi-tenant architecture using MongoDB schemas. It allows for dynamic tenant schemas, version migrations, and secure authentication to protect tenant data.

## Features

- Dynamic Tenant Schemas: Middleware to handle multiple tenant databases based on the tenant ID provided in the request headers.
- Version Migrations: Up and down migrations for fast updates to tenant schemas.
- Authentication: JWT-based authentication to ensure data protection among different schemas and tenants.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Environment variables for configuration

### Installation

1. Clone the repository:

   git clone <repository-url>
   cd nodejs-multitenant-schema

2. Install dependencies:

   npm install

3. Create a .env file in the root directory and add the following variables:

   BASE_DB_NAME=<your_base_db_name>
   MONGO_URI=mongodb://localhost:27017
   TENANTS=<comma_separated_list_of_tenants>
   JWT_SECRET=<your_jwt_secret>

### Usage

1. Start the Application:

   npm start

2. Run Migrations:

   To apply migrations, use:

   npm run migrate up

   To roll back migrations, use:

   npm run migrate down

### Middleware

#### Dynamic Tenant Schema Middleware

The middleware dynamically connects to the tenant's database based on the x-tenant-id header in the request. If the tenant ID is missing, it returns a 400 status code.