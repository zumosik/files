# Files v0.1
It is [MERN](https://www.mongodb.com/mern-stack) app by zumosik  
### Features
The app allows you to:
- create groups
- upload files in groups
#
# Backend 
To start server go to folder api and use
```
npm run dev
npm run start
```
The first command runs the development server using nodemon, while the second command starts the server using node.
### Used libraries:
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Express](https://www.npmjs.com/package/express)
- [CORS](https://www.npmjs.com/package/cors)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Multer](https://www.npmjs.com/package/multer)  
- and others
### Configuration  
You need to configure your .env file  
```
PORT=1234
MONGO_URL=mongodb+srv://<username>:<password>@db.n34j3k.mongodb.net/db?retryWrites=true&w=majority
JWT_SECRET=someString
```
#
# Frontend 
Fronted is React app ([vite](https://vitejs.dev/)) and utilizes  [tailwindcss](https://tailwindcss.com/)
Commands:
```
npm run dev
npm run build
npm run lint
npm run preview
```
- `npm run dev` starts the development server.
- `npm run build` builds the app for production.
- `npm run lint` runs linting checks.
- `npm run preview` serves the built app to preview it.  


Please note that these commands assume you have Node.js and npm installed.

