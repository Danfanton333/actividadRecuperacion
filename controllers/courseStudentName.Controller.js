import { connect } from '../config/database.js';


export const showCourseStudentName = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `course_student_name`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching course_student_name", details: error.message });
    }
};

export const showCourseStudentNameId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `course_student_name` WHERE Course_student_name_id = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Course_student_name not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Course_student_name", details: error.message });
    }
};

export const addCourseStudentName = async (req, res) => {
    try {
        const { courseFk, studentFk, courseName } = req.body;
        if (!courseName)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `course_student_name` (Course_fk, Student_fk, Name) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ courseFk, studentFk, courseName,  ]);
        res.status(201).json({
            data: [{ id: result.insertId, courseFk, studentFk, courseName, }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding order ", details: error.message });
    }
};

export const updateCourseStudentName = async (req, res) => {
    try {
        const { courseFk, studentFk, courseName } = req.body;
        if ( !courseName  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `course_student_name` SET Course_fk=?, Student_fk=?, Name=?  WHERE Course_student_name_id=?";
        const [result] = await connect.query(sqlQuery, [ courseFk, studentFk, courseName, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found"});
        res.status(200).json({
            data: [{ courseFk, studentFk, courseName }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Course_student_name", details: error.message });
    }
};

export const deleteCourseStudentName = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `course_student_name` WHERE Course_student_name_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course_student_name not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Course_student_name", details: error.message});
    }
};
