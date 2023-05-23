**Setup:**

1. Install Node.js:     https://nodejs.org/en/download/

`

**Create Project:**

0. Create & GoTo:  Project Folder

1. RUN: npm init

        {
        "name": "travelgenius",
        "version": "1.0.0",
        "description": "Express project for APIs",
        "main": "server.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "Uditya Laad",
        "license": "MIT"
        }

2. Create File:  `.gitignore` , with following content:

        /node_modules

3. Create File: `server.js`

4. Install Express: `npm install express`

5. Install Nodemon: `npm i -D nodemon`

6. In package.json, replace "scripts" as follows:
    
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "start": "node server.js",
            "dev": "nodemon server.js"
        },
    
7. Start server (in DEV):  npm run dev

    [Note:  Put a console.log(.....) in `server.js` first & crosscheck after running the command]

8. Install dotenv Package (for environment variables): `npm i dotenv`

9. Install MySQL:  `npm i mysql`

10. i] Install Jest:  `npm install --save-dev jest`
    ii] Install SuperTest:  `npm install supertest --save-dev`

11. You are all set for development

