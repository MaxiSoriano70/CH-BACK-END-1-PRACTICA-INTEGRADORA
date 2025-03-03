import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectMongoDB from "./db/db.js";
import userRouter from "./routes/user.router.js";
import postRouter from "./routes/post.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import Post from "./model/post.model.js";

/* Inicializamos nuestras variables de entorno */
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.use(express.json());

connectMongoDB();

/* HANDLEBARS */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

/* ENDPOINTS */
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/", viewsRouter);

/* WEB SOCKET */
io.on("connection", (socket)=>{
    console.log("Nuevo usuario conectado!");

    socket.on("like", async(postId) => {
        try {
            const post = await Post.findByIdAndUpdate(
                postId,
                {$inc: { likes : 1}},
                { new: true }
            );

            io.emit("update likes", { postId, likes: post.likes });
        } catch (error) {
            console.log("Error al actualizar el numero de likes!")
            console.log(error.message);
        }
    });

    socket.on("new post", (post) => {
        io.emit("broadcast post", post);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor iniciado correctamente en http://localhost:${PORT}/`);
});