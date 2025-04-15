import { connect } from '../config/database.js';


export const showCourse = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `course`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching course", details: error.message });
    }
};

export const showCourseId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `course` WHERE Course_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Order not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Course", details: error.message });
    }
};

export const addCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        if (!courseName)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `course` (Course_name) VALUES (?)";
        const [result] = await connect.query(sqlQuery, [ courseName,   ]);
        res.status(201).json({
            data: [{ id: result.insertId, courseName,}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding order ", details: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        if ( !courseName  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `course` SET Course_name=?  WHERE Course_id=?";
        const [result] = await connect.query(sqlQuery, [ courseName, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found"});
        res.status(200).json({
            data: [{ courseName }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Course", details: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `course` WHERE Course_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Course", details: error.message});
    }
};
