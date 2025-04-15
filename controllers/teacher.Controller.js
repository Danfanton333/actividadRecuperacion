import { connect } from '../config/database.js';


export const showTeacher = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `teacher`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching teacher", details: error.message });
    }
};

export const showTeacherId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `teacher` WHERE Teacher_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Teacher not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Teacher", details: error.message });
    }
};

export const addTeacher = async (req, res) => {
    try {
        const { teacherSpecialty, personFk } = req.body;
        if (!teacherSpecialty || ! personFk)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `teacher` (Teacher_specialty, Person_fk ) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [ teacherSpecialty, personFk]);
        res.status(201).json({
            data: [{ id: result.insertId, teacherSpecialty, personFk }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Student ", details: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { teacherSpecialty, personFk} = req.body;
        if ( ! teacherSpecialty || ! personFk) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE teacher SET Teacher_specialty=?, Person_fk=? WHERE Teacher_id=?";
        const [result] = await connect.query(sqlQuery, [ teacherSpecialty, personFk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "teacher not found"});
        res.status(200).json({
            data: [{ teacherSpecialty, personFk }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating teacher", details: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `teacher` WHERE Teacher_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Teacher not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Teacher", details: error.message});
    }
};
