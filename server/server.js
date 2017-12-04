//require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const hbs = require('hbs');
var path = require('path');

var {mongoose} = require('./db/mongoose');
var {ProjectSubmit} = require('./models/projectSubmission');
var {authenticate} = require('./middleware/authenticate');
var {ObjectID} = require('mongodb');
var RegisteredStudent = require('./models/registered_user');


var app = express();
app.set( 'port', ( process.env.PORT || 5000 ));
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const port = process.env.PORT;

app.post('/', (req, res) => {
  
    var projectSubmit = new ProjectSubmit({
        projectName: req.body.projectName,
        projectType:req.body.projectType,
        projectTools:req.body.projectTools,
        projectSummary:req.body.projectSummary,
        memberName:req.body.memberName,
        memberEmail:req.body.memberEmail,
        memberId: req.body.memberId,
        
        
    });
    RegisteredStudent.findOne({student_id: projectSubmit.memberId}, function(err, registered)                                                                 
    {
        
      //  console.log(registered.student_id +" "+ projectSubmit.memberId);
        if(!registered)
        {
            return res.send(`${projectSubmit.memberId} is not registered`);
        }
        projectSubmit.save().then((doc) => {
            //res.send(doc);
            res.render('welcome', doc);
            console.log('In saving page');
           //res.render('projectList', doc);
       }, (e) => {
            res.status(400).send(e);
       });
   });
 
    // projectSubmit.save().then((doc) => {
    //      //res.send(doc);
    //      res.render('welcome', doc);
    //     //res.render('projectList', doc);
    // }, (e) => {
    //      res.status(400).send(e);
    // });

    
 
 });
 
 app.get('/proposalSubmit', (req, res) => {
    res.render('index', { title: 'Synergy Proposal Submission'});
 });

 
 app.get('/proposalList', (req, res) => {
     ProjectSubmit.find().then((projectSubmit)=>{
        res.render('proposalList',{projectSubmit: projectSubmit,title: 'Synergy Proposal List'});
        // res.render('proposalList', { title: 'Synergy Proposal List'});
         
     }, (e) => {
         res.status(404).send(e);
     });

    
 });

 app.get('/registered_student',(req, res) => {
    RegisteredStudent.find().then((registered) =>{
        console.log(registered);
        res.render('registered_student',{registered});


    });
    
 });
 
 app.get('projectSubmission/:id', (req, res) => {
     var id = req.params.id;
     if(!ObjectID.isValid(id)){
         return res.status(404).send();
     }
     Todo.findOne({
         _id: id,
         _creator: req.users._id
     }).then((todo)=>{
         if(!todo){
             return res.status(404).send();
         }
         res.send({todo});
     }).catch( (e) => {
         res.status(400).send();
     });
 });
 app.delete('/projectSubmission/:id',  (req, res) => {
     var id = req.params.id;
 
     if(!ObjectID.isValid(id)){
         return res.status(404).send();
     }
     Todo.findOneAndRemove({
         _id: id,
         _creator: req.users._id
     }).then((todo) => {
         if(!todo){
             return res.status(404).send();
         }
         res.status(200).send({todo});
 
     }).catch( (e) => {
         res.status(400).send();
     });
 
 
 });
 
 app.patch('projectSubmission/:id', (req, res) => {
     var id = req.params.id;
     var body = _.pick(req.body, ['text', 'completed']);
     if(!ObjectID.isValid(id)){
         return res.status(404).send();
     }
     if(_.isBoolean(body.completed) && body.completed){
         body.completedAt = new Date().getTime();
     }else{
         body.completed = false;
         body.completedAt = null;
     }
 
     Todo.findOneAndUpdate({_id:id, _creator: req.users._id}, { $set: body}, {$new: true}).then((todo) => {
         if(!todo){
             return res.status(404).send();
         }
         res.send({todo});
     }).catch((e) => {
         res.status(400).send();
     });
 
 });

//  app.get('/projectList',(req,res) => {
//     res.render('projectList', { title: 'Project Proposal List'});

//  });


 
// app.listen(port, () => {
//     console.log(`Started on port: ${port}`);
// });
app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
});

module.exports = {app};