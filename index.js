const express = require("express")
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())
app.use(express.json())
const dotenv = require("dotenv");
dotenv.config();
const nodemailer=require("nodemailer")
const nodemailgun=require('nodemailer-mailgun-transport');

const auth={
	auth:{
		api_key:'c104e9ea6171a86c1a563f832e94ce6f-50f43e91-a0ed14cc',
		domain:'sandbox4293efe20d224207a08fabc146761dc1.mailgun.org'
	}
};
let transporter=nodemailer.createTransport(nodemailgun(auth))

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
	// const Department = req.body.Department ? req.body.Department : 'office'
	const Contact = req.body.Contact
	const Fac_Contact="1234567890"
	const Faculty_Name="Initx"
	const Fac_Email="initxindia@gmail.com"
	db.query('INSERT INTO appointments(Last_Name,First_Name,Age,Purpose,statusCode,WHO_ARE_YOU,WHOM_TO_VISIT,WHEN_TO_VISIT,Contact,Fac_Name,Fac_Contact,Fac_Email) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [Last_Name, First_Name, Age, Purpose, statusCode, WHO_ARE_YOU, WHOM_TO_VISIT, WHEN_TO_VISIT, Contact,Faculty_Name	, Fac_Contact,Fac_Email], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			// const mailOptions={
			// 	from:'Appointmentregistration@gmail.com',
			// 	to:Fac_Email,
			// 	subject:`You got the Booking Registration from:${First_Name}-${Last_Name}`,
			// 	text:"Please Check your Appointment List"
			// }
			// transporter.sendMail(mailOptions,function(err,data){
			// 	if(err){
			// 		console.log(err,"err")
			// 	}else{
			// 		console.log("Mail Sent")
			// 	}
			// })
			
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
// app.get("/appointments", (req, res) => {
// 	db.query(`SELECT * FROM appointments  `, (err, result) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.send(result);
// 		}
// 	});
// });
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

//Faculty API
app.post('/createFaculty', (req, res) => {
	const Last_Name = req.body.LastName
	const First_Name = req.body.FirstName
	const Contact = req.body.Contact
	const password = req.body.password
	const Email="initxindia@gmail.com"
	db.query(`SELECT * FROM facultyprofile WHERE Contact = ${Contact}`, (err, result) => {
		if (result && result.length === 0) {
			db.query('INSERT INTO facultyprofile(Last_Name,First_Name,Contact,password,Email) VALUES(?,?,?,?,?)', [Last_Name, First_Name, Contact, password,Email], (err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.send({ success: true, message: "successfully Created faculty", FacultyCreated: true })
				}
			})
		}
		else {
			res.send({ success: true, message: result ? "Faculty already exist ,please redirect login page" : "Please fill the details to proceed", Data: result })
		}
	})
})


//faculty Login
app.get("/facLogin", (req, res) => {
	db.query(`SELECT * FROM facultyprofile WHERE Contact=${req.query.contact} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ data: result, message: "user  profile Details", success: true });
		}
	});
});
//Get Faculty List
app.get("/faculty", (req, res) => {
	db.query(`SELECT * FROM facultyprofile `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ data: result, message: "user  profile Details", success: true });
		}
	});
});
//Individual faculty Data
app.get("/facappointments", (req, res) => {
	db.query(`SELECT * FROM appointments WHERE Fac_Contact=${req.query.contact} `, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send({ data: result, message: "user  profile Details", success: true });
		}
	});
});


//Faculty to see How many request he has call myorder api.