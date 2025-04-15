import { connect } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Función para mostrar todos los usuarios
export const showApiUser = async (req, res) => {
    try {
        let sqlQuery = "SELECT * FROM api_users";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users", details: error.message });
    }
};

// Función para mostrar un usuario por ID
export const showApiUserId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM api_users WHERE Api_users_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user", details: error.message });
    }
};

// Función para agregar un nuevo usuario (CRUD)
export const addApiUser = async (req, res) => {
    try {
        const { user, password } = req.body;

        // Validar campos obligatorios
        if (!user || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Hashear la contraseña antes de guardarla
        const trimmedPassword = password.trim(); // Eliminar espacios en blanco
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Insertar el nuevo usuario en la base de datos
        const sqlQuery = `
            INSERT INTO api_users (Api_user, Api_password)
            VALUES (?, ?)
        `;
        const [result] = await connect.query(sqlQuery, [user, hashedPassword]);

        // Respuesta exitosa
        res.status(201).json({
            data: {
                id: result.insertId,
                user
            },
            status: 201
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding user", details: error.message });
    }
};

// Función para actualizar un usuario existente
export const updateApiUser = async (req, res) => {
    try {
        const { user, password } = req.body;

        // Si se proporciona una nueva contraseña, hashearla antes de guardarla
        let hashedPassword = null;
        if (password) {
            const trimmedPassword = password.trim();
            hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        }

        // Actualizar el usuario en la base de datos
        let sqlQuery = "UPDATE api_users SET Api_user=?, Api_password=? WHERE Api_users_id=?";
        const [result] = await connect.query(sqlQuery, [
            user,
            hashedPassword || null, // Solo actualiza si se proporciona una nueva contraseña
            req.params.id
        ]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        // Respuesta exitosa
        res.status(200).json({
            data: [{ user }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating user", details: error.message });
    }
};

// Función para eliminar un usuario
export const deleteApiUser = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM api_users WHERE Api_users_id = ?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        // Respuesta exitosa
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
};

// Función para manejar el inicio de sesión
export const loginApiUser = async (req, res) => {
    try {
        // Extraer user y password del cuerpo de la solicitud
        const { user, password } = req.body;

        // Validar campos obligatorios
        if (!user || !password) {
            return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
        }

        // Buscar al usuario en la base de datos
        let sqlQuery = "SELECT * FROM api_users WHERE Api_user = ?";
        const [rows] = await connect.query(sqlQuery, [user]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const userData = rows[0];

        // Comparar la contraseña hasheada con la contraseña proporcionada
        const isPasswordValid = await bcrypt.compare(password, userData.Api_password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Generar un token JWT
        const token = jwt.sign(
            {
                id: userData.Api_users_id,
                user: userData.Api_user
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Respuesta exitosa
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: userData.Api_users_id,
                user: userData.Api_user
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
    }
};