# WHAT IF MS

## DESCRIPTION
CSI 680 Project - A TEAM

## INSTALLATION AND SET UP

### FRAMEWORK
- **Node.js**: Install from [nodejs.org](https://nodejs.org/) (ideally v20.18.0).
- **MySQL Server and MySQL Workbench**: Install from [MySQL Downloads](https://dev.mysql.com/downloads/) (ideally 8.4).
- **Git**: Install from [git-scm.com](https://git-scm.com/).
- **Verify** verify everything runs.

### SET UP
1. **CLONE THIS REPO**
```bash
   git clone https://github.com/TK94975/MS_What_IF.git
```
2. **Install Global dependencies**
```bash
   cd MS_What_IF
   npm install
```
3. **Install Server dependencies**
```bash
   cd MS_What_IF/server
   npm install
```
4. **Install Client dependencies**
```bash
   cd ../client
   npm install
```
5. **Create Environment Variables**
Create a file called `.env` in the directory `MS_What_IF/server` and add the following lines (edit it so your database password and username are the same as when you installed MySQL)
```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=what_if_ms
    PORT=5000
```
6. **Create the Database**
```bash
    cd ../server
    node initDB.js
```
7. **Run the Application**
Go to root folder of the application i.e. `MS_What_IF/` and run the following command:
```bash
    npm run dev
```
It should open up your browser and display the users table with some dummy users.