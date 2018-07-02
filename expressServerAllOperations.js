const express = require('express');
var morgan = require('morgan');
var validator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');

//Data Model for grades 
//========================================================================
class Grade{
    constructor(id,name,course,grade){
        this.id=id;
        this.name=name;
        this.course=course;
        this.grade=grade;
    }
}
var gradesDB=[]; // MOCK Database
var id=5;

//===========================================================================

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.urlencoded({extended:true}));
app.use(validator());

var port = 5000;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();   // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
   return next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:5000/api)
router.get('/', function(req, res) {
    res.json({ message: 'great job! welcome to the api!' }); 
  

    console.log(`Added One Record On the Database [${grade.name}]`)
});

// more routes for the API will happen here

// on routes that end in /grades
// ----------------------------------------------------
router.route('/grades')
                    .post((req,resp)=>{
                        console.log('posting data received')
                        req.assert('name','name field is required').notEmpty();
                        req.assert('course','course field is required').notEmpty();
                        req.assert('grade','grade field is required').notEmpty();
                        var errors =req.validationErrors();
                        if(errors) resp.json({message:errors});
                        else{
                        var name = req.body.name;
                        var course = req.body.course;
                        var grade = req.body.grade;
                        var gradeInstance = new Grade(id,name,course,grade);
                        id++;
                        gradesDB.push(gradeInstance);
                        resp.json({message:'grade created successfully!'});}

                    })
                    .get((req,resp)=>{
                        console.log('size: '+gradesDB.length);
                        if(gradesDB.length==0)
                            resp.send(new Error());
                        resp.json(gradesDB);
                    })
//===================================================================
// on routes that end in /grades/:grade_id
// ----------------------------------------------------
router.route('/grades/:grade_id')
                          .get((req,resp)=>{
                              var id = req.params.grade_id;
                              var name =req.body.name;
                              var course = req.body.course;
                              var gradeNew = req.body.grade;
                              var grade;
                              for(let g of gradesDB){
                                if(g.id==id) grade = g;
                              }
                              
                              if(!grade) resp.send(new Error('No grade with such id'));
                              resp.json(grade);
                          })
                          .put((req,resp)=>{
                            var id = req.params.grade_id;
                            var grade;
                            for(let g of gradesDB){
                              if(g.id==id) grade = g;
                            }
                            if(!grade) resp.send(new Error('No grade with such id'));
                            grade.name=name;
                            grade.course=course;
                            grade.grade=gradeNew;
                            resp.json({message:'grade updated successfully!'});
                          })
                          .delete((req,resp)=>{
                            var id = req.params.grade_id;
                            var grade;
                            for(let g of gradesDB){
                                if(g.id==id) grade = g;
                              }
                            if(!grade) resp.send(new Error('No grade with such id'));
                            gradesDB.pop(grade);
                            resp.json({message:'deleting done successfully'});
                          });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, function(){
    console.log('Server Running on: '+ port);
    console.log('Loading Data...');
    var grade1 = new Grade('1', 'Ahmed', 'MWA', 'A');
    var grade2 = new Grade('2', 'Moke', 'WAA', 'A');
    var grade3 = new Grade('3', 'Berry', 'WAA', 'A');
    var grade4 = new Grade('4', 'Edu', 'EA', 'A');
    gradesDB.push(grade1);
    gradesDB.push(grade2);
    gradesDB.push(grade3);
    gradesDB.push(grade4);
});
