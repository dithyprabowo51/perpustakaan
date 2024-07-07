# Backend Test Case

## Source code on github
https://github.com/dithyprabowo51/perpustakaan

## Requirement
- Node JS latest stable version
- NPM lates stable version
- Database MySQL latest stable version

## Installation on premise or local computer

### Install library
- Run command "npm install"

### Setup environment variable
- Create file ".env"
- Use file ".env.example" as reference

### Database Migration
- Create your database scheme based on configuration in file ".env"
- Run command "npm run migrate" for migrate tables
- Run command "npm run seed" for seed initial data

## Running application
- Run command "npm start"

## API Documentation
- Use file "open_api_perpus.json" as openapi spec
- You can import that file to swagger editor, etc