# Files v0.1
It is [MERN](https://www.mongodb.com/mern-stack) app by zumosik  
You can:
- create groups
- upload files in groups
#
# Backend 
To start server go to folder api and use
```
npm run dev
npm run start
```
(first to run dev server using nodemon and second to start server using node)
### Used libraries:
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Express](https://www.npmjs.com/package/express)
- [CORS](https://www.npmjs.com/package/cors)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Multer](https://www.npmjs.com/package/multer)  
and some other
### Configuration  

You need to configure your .env file  
In .env file must be  
- PORT
- [MONGO_URL](https://www.mongodb.com/)
- JWT_SECRET

Like this:
```
PORT=1234
MONGO_URL=mongodb+srv://a:qwerty@db.n34j3k.mongodb.net/db?retryWrites=true&w=majority
JWT_SECRET=someString
```
#
# Frontend 
Fronted is React app ([vite](https://vitejs.dev/)) and using [tailwindcss](https://tailwindcss.com/)
Commands:
```
npm run dev
npm run build
npm run lint
npm run preview
```
First to run dev server  
Second to build app
