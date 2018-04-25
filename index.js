var http = require("http");
var express=require("express");
const path = require('path');
const PORT = process.env.PORT || 5000
var bodyParser = require('body-parser');
const { Pool } = require('pg');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.get("/",function(req,res){
	res.render("form");  
});


app.post("/",async (req,res) =>
{
	
  try {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var age = req.body.age;
	var dob = req.body.dob;
	var gender = req.body.gender;
	var phone = req.body.phone;
	var other = req.body.other;
    const client = await pool.connect()
    const result = await client.query('Insert INTO paitent (firstname,lastname,age,dob,gender,phone,other) VALUES ($1,$2,$3,$4,$5,$6,$7)',[firstname,lastname,age,dob,gender,phone,other]);
    res.redirect('/');
	client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }

	
});

app.get('/search', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM paitent');
    res.render('search',{results: result.rows});
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));