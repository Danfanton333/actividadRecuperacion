import { connect } from '../config/database.js';


export const showStudent = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `student`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Student", details: error.message });
    }
};

export const showStudentId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `student` WHERE Student_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Student not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Student", details: error.message });
    }
};

export const addStudent = async (req, res) => {
    try {
        const { studentDegree, personFk } = (req.body);
        if (!studentDegree )  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO student (Student_degree, Person_fk ) VALUES (?,?)";
        const [result] = await connect.query(sqlQuery, [ studentDegree, personFk ]);
        res.status(201).json({
            data: [{ id: result.insertId, studentDegree, personFk }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding Student ", details: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { studentDegree,  personFk } = req.body;
        if ( ! studentDegree || ! personFk ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE student SET Student_degree=?, Person_fk=? WHERE Student_id=?";
        const [result] = await connect.query(sqlQuery, [ studentDegree, personFk, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "student not found"});
        res.status(200).json({
            data: [{ studentDegree,  personFk }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating person", details: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `student` WHERE Student_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "student not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting student", details: error.message});
    }
};
