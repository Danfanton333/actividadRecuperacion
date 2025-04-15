import cors from 'cors';  // 🔹 Importar CORS
import express from 'express';
import apiUserRoutes from '../routes/apiUser.Routes.js'
import courseRoutes from '../routes/course.Routes.js';
import courseStudentNameRoutes from '../routes/courseStudentName.Routes.js';
import courseTeacherHoursRoutes from '../routes/courseTeacherHours.Routes.js';
import personRoutes from '../routes/person.Routes.js';
import studentRoutes from '../routes/student.Routes.js';
import teacherRoutes from '../routes/teacher.Routes.js';
import teacherStudentClassesRoutes from '../routes/teacherStudentClasses.Routes.js';

const app = express();

app.use(cors({
    origin: "*",  // Puedes cambiar "*" por "http://localhost:5501" si solo permites tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

app.use('/api_v1', apiUserRoutes);
app.use('/api_v1', courseRoutes);
app.use('/api_v1', courseStudentNameRoutes);
app.use('/api_v1', courseTeacherHoursRoutes);
app.use('/api_v1', personRoutes);
app.use('/api_v1', studentRoutes);
app.use('/api_v1', teacherRoutes);
app.use('/api_v1', teacherStudentClassesRoutes);



app.use((rep, res, next) => {
    res.status(404).json({
        message: 'Endpoint losses'
    });
});

export default app;
