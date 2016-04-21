var express = require('express');
var router = express.Router();

var User = require('./../models/user.js');
var Task = require('./../models/task.js');//Specify models used



router.get('/', function (req, res, next) {
    Task.find( { completed : false}, function (error, allTasks){
        if (error)  // get an allTasks (array) unless there is an error
        {
            return next(error);
        }
        res.render('tasks', {title : "TODO", tasks : allTasks });
    });
});


router.get('/', function(req, res, next){

    Task.find( { _creator : req.user._id , completed : false} , function(err, incomplete) {
        res.render('tasks', {
            title: 'Tasks to do',
            username: req.user.auth.username.toUpperCase(),
            tasks: incomplete || []
        });
    });
});


router.post('/addtask', function(req, res, next) {

    console.log('Adding task...');

    if (!req.body || !req.body.task_name) {
        return next(new Error('no data provided'));
    }

    //Create a new task by instantiating a Task object...
    var newTask = Task( {
        name : req.body.task_name,
        completed: false } );

    //Then call the save method to save it to the database. Note callback.
    newTask.save(function(err){
        if (err) {
            return next(err);
        }
        else {
            res.redirect('/tasks');
        }
    });
});


router.get('/completed', function(req, res, next){

    Task.find({ completed : true}, function(err, completedList) {
        if (err) {
            return next(err);
        }
        res.render('tasks_completed', {
            title: 'completed',
            tasks: completedList || []
        });
    });
});


/**Set all tasks to completed, display empty tasklist */
router.post('/alldone', function(req, res, next) {

    Task.update({  '_creator' : req.user._id, 'completed' : false}, { $set: { 'completed' : true }}, { 'multi' : true }, function (err, result) {

        if (err) {
            return next(err);
        }

        req.user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/tasks');
        })
    });
});


router.param('task_id', function(req, res, next, taskId) {

    console.log("params being extracted from URL for " + taskId);

    req.taskid = taskId;
    return next();

    /* Alternatively, could fetch a task from the database
     and attach it to the req object. In the complete task method,
     would set req.task.completed = true and
     call the req.task.save method to update the db.
     */

});


router.post('/:task_id', function(req, res, next) {

    if (!req.body.completed) {
        return next(new Error('body missing parameter?'))
    }

    Task.findByIdAndUpdate(req.task._id, {completed : true }, function (error, result){
        if (error)
        {
            return next(error);
        }
        res.redirect('/tasks');
    } );

});


router.delete('/:task_id', function(req, res, next) {

    Task.remove({ '_id' : req.taskid },  function(err) {
        if (err) {
            return next(error);
        }
        res.sendStatus(200); //send success to AJAX call.
    });
});

module.exports = router;