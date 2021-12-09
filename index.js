const express = require("express")
const app = express();
const mysql=require('mysql')
const cors = require('cors')
app.use(cors())
app.use(express.json())
const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "password",
	database: "employeeSystem",
});
app.post('/create', (req, res) => {
    const name = req.body.name
    const age = req.body.age
    const position = req.body.position
    
    db.query('INSERT INTO emplyees(name,age,positon) VALUES(?,?,?)', [name, age, position], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("successfully created the Entry")
        }
    })
})
app.get("/employees", (req, res) => {
	db.query("SELECT * FROM emplyees", (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

app.delete("/delete-employees", (req, res) => {
	let id = req.body.id;
	let querry="DELETE  FROM emplyees WHERE id  = ?"
    db.query(querry,id, (err, result) => {
			if (err) {
				console.log(err, "error in deleting employees");
			} else {
				res.send("Successfully Deleted selected Data ");
			}
		});
}) 
app.listen(3001, () => {
    console.log("server is running");
})