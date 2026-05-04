# GrocerIQ

## Team Member Contributions
- Sean Travis
    Home Dashboard, Gorcery List Manager, and Product Search/Filter page implementations, security.txt, README.md
  
- Shakine Hardaway
    Database Schema Design and Setup, data.sql, db_desgin.pdf, prelim.pdf
  
- Senait Pirani
    Product Detail & Community Forum implementation
  
- Emmanuel Pierre
    Frontend styling changes and react/nextjs implementation, README.md
  
- Tate Matthews
    Program File Organization and initial code creation, Signup/Login implementation, prelim.pdf

## Technologies
-JDBC
-BCrypt
-React
-NextJs
    
## Requirements
- Java 17+
- Maven
- Node.js 20.9+
- MySQL running on `localhost:33306`

## JDBC Info
-DB Name: grocery_tracker (mysql://localhost:33306/grocery_tracker using 'mysql-server-x370' docker container)
-DB Username: root
-DB Password: mysqlpass

## Database
```bash
mysql -h 127.0.0.1 -P 33306 -u root -pmysqlpass < ddl.sql
mysql -h 127.0.0.1 -P 33306 -u root -pmysqlpass < data.sql
```

## Backend
```bash
cd backend
mvn spring-boot:run
```

Runs at `http://localhost:8080`.

## Frontend
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000` and proxies `/api/*` to Spring Boot.

Demo logins: `testuser1` / `pass1`, `testuser2` / `pass2`, `admin` / `adminpass`
