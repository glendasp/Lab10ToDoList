/**
 * Created by glendex on 4/20/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    name: String,
    completed: Boolean
});

//Compile schema into a Mongoose model
var Task = mongoose.model('Task', taskSchema);

module.exports = Task; // Provide as an export so that other part of the code can work with Task objects.

