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
var publicDir = require('path').join(__dirname,'/public'); 
app.use(express.static(publicDir)); 

var port = process.env.PORT || 8080;

//Create connection
const conn = mysql.createPool({
  connectionLimit: 10,
    host: "remotemysql.com",
    port: "3306",
    user: "o3zfjbLpmQ",
    password: "1sOzk9TwZs",
    database: "o3zfjbLpmQ"
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

  let sql = "SELECT * FROM task order by tag_id asc";
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
  
  let data = {task: req.body.task, tag: getRadioChecked(req), tag_id: getIdRadioChecked(req)};
  let sql = "INSERT INTO task SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    conn.destroy;
    res.redirect('/');
  });
});

function getRadioChecked(req){
  if(req.body.priorityHigh=="Danger")
    return "Danger";
  if(req.body.priorityMedium=="Warning")
    return "Warning";
  if(req.body.priorityLow=="Success")
    return "Success";
};

function getIdRadioChecked(req){
  if(req.body.priorityHigh=="Danger")
    return "1";
  if(req.body.priorityMedium=="Warning")
    return "2";
  if(req.body.priorityLow=="Success")
    return "3";
};
 
//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE task SET task='"+req.body.task+"', tag='"+req.body.tag+"' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    conn.destroy;
    res.redirect('/');
  });
});

//route for update data
app.post('/done',(req, res) => {
  let sql = "UPDATE task SET status='c' WHERE id="+req.body.id;
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