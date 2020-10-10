//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

var port = process.env.PORT || 8080;

//Create connection
const conn = mysql.createConnection({
    host: "remotemysql.com",
    port: "3306",
    user: "o3zfjbLpmQ",
    password: "1sOzk9TwZs",
    database: "o3zfjbLpmQ"
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
 
//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM task";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    conn.destroy;
    res.render('task_view',{
      results: results
    });
  });
});
 
//route for insert data
app.post('/save',(req, res) => {
  let data = {task: req.body.task, tag: req.body.tag};
  let sql = "INSERT INTO task SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    conn.destroy;
    res.redirect('/');
  });
});
 
//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE task SET task='"+req.body.task+"', tag='"+req.body.tag+"' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    conn.destroy;
    res.redirect('/');
  });
});
 
//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM task WHERE id="+req.body.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    conn.destroy;
      res.redirect('/');
  });
});
 
//server listening
app.listen(port, () => {
  console.log('Server is running at port 8000');
});