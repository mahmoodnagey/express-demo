const express = require('express');
const router = express.Router();
const Joi = require('joi'); // for input validation

//example for array of courses
const courses = [
    {id: 1, name: 'HTML'},
    {id: 2, name: 'CSS'},
    {id: 3, name: 'Javascript'},
];

// Handling http get requests to view the courses
router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found!');
    res.send(course);
});

// Handling http POST requests to add a new course
router.post('/', (req, res) => {
    
    // Using joi package for input validation

    const { error } = validateCourse(req.body); // using object destructure = result of validateCourse.error
    if (error) return res.status(400).send(error.details[0].message); // if there was an error value, meaning not matching the schema
        
 
    
    const course = {
        id: courses.length + 1, // no Database, so we write id manually for testing
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
})

// Handling http PUT requests to update course
router.put('/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404 - not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found!');
    
    // Validate
    // If invalid, return 400 - Bad Request
    const { error } = validateCourse(req.body); // using object destructure = result of validateCourse.error
    if (error) if (error) return res.status(400).send(error.details[0].message); // if there was an error value, meaning not matching the schema

    
    // Update course
    // Return the updated course to the client
    course.name = req.body.name;
    res.send(course);
});

// Handling http DELETE requests
router.delete('/:id', (req, res) => {
    // Look up the course
    // Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID is not found!');
    
    // DELETE the course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    // Return the same course
    res.send(course);
});

function validateCourse(course) {
    
    const schema = {        // create schema to be used with joi
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema); // validate the request body with the schema we just created
}

module.exports = router;