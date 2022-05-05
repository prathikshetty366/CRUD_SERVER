const express = require("express")
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())
app.use(express.json())
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});
app.post('/createProfile', (req, res) => {
	const Last_Name = req.body.LastName
	const First_Name = req.body.FirstName
	const Age = req.body.Age
	const Contact = req.body.Contact
	const password = req.body.password
	db.query(`SELECT * FROM userprofile WHERE Contact = ${Contact}`, (err, result) => {
		if (result && result.length === 0) {
			db.query('INSERT INTO userprofile(Last_Name,First_Name,Age,Contact,password) VALUES(?,?,?,?,?)', [Last_Name, First_Name, Age, Contact, password], (err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.send({ success: true, message: "successfully Created Profile", userCreated: true })
				}
			})
		}
		else {
			res.send({ success: true, message: result ? "user already exist ,please redirect login page" : "Please fill the details to proceed", Data: result })
		}
	})
})
app.post('/Login', (req, res) => {
	const Contact = req.body.Contact;
	db.query(`SELECT * FROM userprofile WHERE Contact=${Contact}`, (err, result) => {
		if (err) {
			console.log(err)
		}
		else {
			res.send({ result, message: "User Credentials" })
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
	db.query('INSERT INTO appointments(Last_Name,First_Name,Age,Purpose,statusCode,WHO_ARE_YOU,WHOM_TO_VISIT,WHEN_TO_VISIT,Department,Contact) VALUES(?,?,?,?,?,?,?,?,?,?)', [Last_Name, First_Name, Age, Purpose, statusCode, WHO_ARE_YOU, WHOM_TO_VISIT, WHEN_TO_VISIT, Department, Contact], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ message: "successfully Booked Your Appointment" })
		}
	})
})
app.get("/myorders", (req, res) => {
	db.query(`SELECT * FROM appointments WHERE Contact=${req.query.contact} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ result, message: "you're booked appointments", success: true });
		}
	});
});
app.get("/profile", (req, res) => {
	db.query(`SELECT * FROM userprofile WHERE Contact=${req.query.contact} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ data: result, message: "user  profile Details", success: true });
		}
	});
});
//admins API
app.get("/appointments", (req, res) => {
	db.query(`SELECT * FROM appointments  `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});
app.put("/Reject", (req, res) => {
	const id = req.body.id
	db.query(`UPDATE appointments SET statusCode="2" WHERE Personid=${id} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ message: "Rejected the Request Successfully" });
		}
	});
})
app.put("/Accept", (req, res) => {
	const id = req.body.id
	db.query(`UPDATE appointments SET statusCode="1" WHERE Personid=${id} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ message: "Accepted the Request Successfully" });
		}
	});
});
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`server is running at ${PORT}`);
})  