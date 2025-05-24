// Importamos las librerías necesarias
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // parsea application/json

// Conectamos a la base de datos SQLite
let db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');

        // Creamos la tabla si no existe
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo TEXT NOT NULL,
            created_at INTEGER
        )`, (err) => {
            if (err) {
                console.error("Error al crear la tabla:", err.message);
            } else {
                console.log('Tabla "todos" lista.');
            }
        });
    }
});

// Endpoint para agregar una tarea
app.post('/agrega_todo', (req, res) => {
    const { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ error: 'El campo "todo" es requerido.' });
    }

    const createdAt = Math.floor(Date.now() / 1000);

    const stmt = db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, ?)');
    stmt.run(todo, createdAt, function (err) {
        if (err) {
            console.error("Error al insertar:", err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log("Tarea insertada con éxito.");
        res.status(201).json({
            message: 'Tarea agregada exitosamente',
            id: this.lastID
        });
    });
    stmt.finalize();
});

// Endpoint para listar tareas
app.get('/listar_todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Ruta base
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

// Endpoint de login para pruebas
app.post('/login', (req, res) => {
    console.log(req.body);
    res.json({ status: 'ok' });
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${3000}`);
});
