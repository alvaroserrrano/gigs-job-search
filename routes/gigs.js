const express = require('express');
const router = express.Router();

const db = require('../config/db');
const Gig = require('../models/Gig');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//Get gig list
router.get('/', (req, res) => {
    Gig.findAll()
        .then(gigs => {
            console.log(gigs);
            res.render('gigs', { gigs })
        })
        .catch(err => console.log(error))
});

//Display add gig form
router.get('/add', (req, res) => res.render('add'))

//Add a gig
router.post('/add', (req, res) => {

//destructuring
let { title, technologies, budget, description, contact_email } = req.body;
//VALIDATION
//array of errors
let errors = [];

//validate fields
if(!title){
    errors.push({text: 'Please add a title'});
}
if(!technologies){
    errors.push({text: 'Please add some technologies'});
}
if(!description){
    errors.push({text: 'Please add a description'});
}
if(!contact_email){
    errors.push({text: 'Please add a contact email'});
}

//check for errors
if(errors.length > 0){
    //re-render the form
    res.render('add', {
        errors,
        title, 
        technologies,
        description,
        contact_email
    });
}else{

    //Set budget to unknown if no budget is added
    if(!budget){
        budget='Unknown';
    }else{
        budget = `$${budget}`
    }

    //make lower case and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    //insert into table
    Gig.create({
        title,
        technologies,
        budget, 
        description,
        contact_email
    })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
}
});

//Search for gigs
router.get('/search', (req, res) => {
    //destructuring
    let { term } = req.query;

    term = term.toLowerCase();

    //match the word to 'technologies'
    //'LIKE' sequelize--> bring Op object 
    Gig.findAll({ where: {technologies: { [Op.like]: '%' + term + '%' } } })
        .then(gigs => res.render('gigs', { gigs }))
        .catch(err => console.log(err));
});


module.exports = router;