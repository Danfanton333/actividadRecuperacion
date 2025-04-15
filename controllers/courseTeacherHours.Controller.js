import { connect } from '../config/database.js';


export const showCourseTeacherHours = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `course_teacher_hours`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching course_teacher_hours", details: error.message });
    }
};

export const showCourseTeacherHoursId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `course_teacher_hours` WHERE Course_teacher_hours_id =?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "Course_teacher_hours not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Course_teacher_hours", details: error.message });
    }
};

export const addCourseTeacherHours = async (req, res) => {
    try {
        const { courseFk, teacherFk, hours } = req.body;
        if (!hours)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `course_teacher_hours` (Course_fk, Teacher_fk, Hours) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [  courseFk, teacherFk, hours, ]);
        res.status(201).json({
            data: [{ id: result.insertId,  courseFk, teacherFk, hours,}],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding order ", details: error.message });
    }
};

export const updateCourseTeacherHours = async (req, res) => {
    try {
        const {  courseFk, teacherFk, hours } = req.body;
        if ( ! hours  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `course_teacher_hours` SET Course_fk=?, Teacher_fk=?, Hours=?  WHERE course_teacher_hours_id=?";
        const [result] = await connect.query(sqlQuery, [  courseFk, teacherFk, hours, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course not found"});
        res.status(200).json({
            data: [{  courseFk, teacherFk, hours }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating Course_teacher_hours", details: error.message });
    }
};

export const deleteCourseTeacherHours = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `course_teacher_hours` WHERE Course_teacher_hours_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Course_teacher_hours not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Course_teacher_hours", details: error.message });
    }
};