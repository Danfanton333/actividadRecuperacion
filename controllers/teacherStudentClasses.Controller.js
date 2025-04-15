import { connect } from '../config/database.js';


export const showTeacherStudentClasses = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `teacher_student_classes`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching teacher_student_classes", details: error.message });
    }
};

export const showTeacherStudentClassesId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `teacher_student_classes` WHERE Teacher_student_classes_id =?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "teacher_student_classes not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching teacher_student_classes", details: error.message });
    }
};

export const addTeacherStudentClasses = async (req, res) => {
    try {
        const { teacherFk, studentFk, classes } = req.body;
        if (!classes)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `teacher_student_classes` (Teacher_fk, Student_fk, Classes) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [   teacherFk, studentFk, classes  ]);
        res.status(201).json({
            data: [{ id: result.insertId,   teacherFk, studentFk, classes }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding teacher_student_classes ", details: error.message });
    }
};

export const updateTeacherStudentClasses = async (req, res) => {
    try {
        const {   teacherFk, studentFk, classes } = req.body;
        if ( ! classes  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `teacher_student_classes` SET Teacher_fk=?, Student_fk=?, Classes=?  WHERE Teacher_student_classes_id=?";
        const [result] = await connect.query(sqlQuery, [   teacherFk, studentFk, classes, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "teacher_student_classes not found"});
        res.status(200).json({
            data: [{   teacherFk, studentFk, classes }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating teacher_student_classes ", details: error.message });
    }
};

export const deleteTeacherStudentClasses = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM `teacher_student_classes` WHERE Teacher_student_classes_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "teacher_student_classes not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting teacher_student_classes", details: error.message });
    }
};