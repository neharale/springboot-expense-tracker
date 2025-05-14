# Spring Boot Expense Tracker

A simple, secure, and extensible online expense tracker built with Java and Spring Boot.

## Features

- User registration and login with JWT authentication
- CRUD operations for expenses (add, view, update, delete)
- H2 in-memory database for easy setup and testing
- Modular code structure (Controller, Service, Repository layers)

## Tech Stack

- Java 17+
- Spring Boot 3.x
- Spring Security 6.x (JWT)
- Spring Data JPA
- H2 Database
- Lombok

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/neharale/springboot-expense-tracker.git
   cd springboot-expense-tracker
   ```

2. **Run the application:**
   ```sh
   mvn spring-boot:run
   ```

3. **Test the API using Postman or cURL.**

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and receive a JWT token
- `GET /api/expenses` — List all expenses (requires JWT)
- `POST /api/expenses` — Add a new expense (requires JWT)
- `PUT /api/expenses/{id}` — Update an expense (requires JWT)
- `DELETE /api/expenses/{id}` — Delete an expense (requires JWT)

## License

This project is licensed under the MIT License.