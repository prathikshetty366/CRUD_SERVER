const express = require("express")
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())
app.use(express.json())
const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "password",
	database: "visitor",
});
app.post('/createProfile', (req, res) => {
	const Last_Name = req.body.LastName
	const First_Name = req.body.FirstName
	const Age = req.body.Age
	const Contact = req.body.Contact
	const password = req.body.password
	db.query('INSERT INTO userprofile(Last_Name,First_Name,Age,Contact,password) VALUES(?,?,?,?,?)', [Last_Name, First_Name, Age, Contact, password], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send("Profile Created Successfully")
		}
	})
})
app.post('/create', (req, res) => {
	const Last_Name = req.body.LastName
	const First_Name = req.body.FirstName
	const Age = req.body.Age
	const Purpose = req.body.Purpose
	const statusCode = req.body.statusCode
	const WHO_ARE_YOU = req.body.whoAreYou
	const WHOM_TO_VISIT = req.body.whomToVisit
	const WHEN_TO_VISIT = req.body.whenToVisit
	const Department = req.body.Department ? req.body.Department : 'office'
	const Contact = req.body.Contact
	db.query('INSERT INTO users(Last_Name,First_Name,Age,Purpose,statusCode,WHO_ARE_YOU,WHOM_TO_VISIT,WHEN_TO_VISIT,Department,Contact) VALUES(?,?,?,?,?,?,?,?,?,?)', [Last_Name, First_Name, Age, Purpose, statusCode, WHO_ARE_YOU, WHOM_TO_VISIT, WHEN_TO_VISIT, Department, Contact], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send("successfully Booked Your Appointment")
		}
	})
})
app.get("/appointments", (req, res) => {
	db.query(`SELECT * FROM users  `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});
app.get("/myorders", (req, res) => {
	db.query(`SELECT * FROM users WHERE Contact=${req.body.contact} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send("your Booked appointments", result);
		}
	});
});
app.put("/Reject", (req, res) => {
	const id =
		db.query(`UPDATE users SET statusCode="2" WHERE Personid=${id} `, (err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send("Rejected the Request Successfully");
			}
		});
})
app.put("/Accept", (req, res) => {
	const id = req.body.id
	db.query(`UPDATE users SET statusCode="1" WHERE Personid=${id} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send("Accepted the Request Successfully");
		}
	});
});


const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server is running at ${PORT}`);
})