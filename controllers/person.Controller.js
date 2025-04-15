import { connect } from '../config/database.js';


export const showPerson = async (req, res) => {
    try {
        let sqlQuery= "SELECT * FROM `person`";
        const [result] = await connect.query(sqlQuery);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching person", details: error.message });
    }
};

export const showPersonId = async (req, res) => {
    try {
        const [result] = await connect.query('SELECT * FROM `person` WHERE Person_id =? ', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ error: "person not found"});
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching person", details: error.message });
    }
};

export const addPerson = async (req, res) => {
    try {
        const { personName, personDocument, personAge } = req.body;
        if (!personName)  {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let sqlQuery = "INSERT INTO `person` (Person_name, Person_document, Person_age ) VALUES (?,?,?)";
        const [result] = await connect.query(sqlQuery, [ personName, personDocument, personAge,]);
        res.status(201).json({
            data: [{ id: result.insertId, personName, personDocument, personAge, }],
            status: 201
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding person ", details: error.message });
    }
};

export const updatePerson = async (req, res) => {
    try {
        const { personName, personDocument, personAge } = req.body;
        if ( ! personName  ) {
            return res.status(400).json({ error: "Missing required fields "});
        }
        let sqlQuery = "UPDATE `person` SET Person_name=?, Person_document=?, Person_age=? WHERE Person_id=?";
        const [result] = await connect.query(sqlQuery, [ personName, personDocument, personAge, req.params.id ]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "person not found"});
        res.status(200).json({
            data: [{ personName, personDocument, personAge }],
            status: 200,
            updated: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating person", details: error.message });
    }
};

export const deletePerson = async (req, res) => {
    try {
        let sqlQuery = "DELETE FROM person WHERE Person_id=?";
        const [result] = await connect.query(sqlQuery, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "person not found" });
        res.status(200).json({
            data: [],
            status: 200,
            deleted: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting person", details: error.message});
    }
};
