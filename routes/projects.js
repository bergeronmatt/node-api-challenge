const express = require('express');

const router = express.Router();
const projectsMethod = require ('../data/helpers/projectModel');

//custom middleware

function validateId(req, res, next) {
    projectsMethod.get(req.params.id)
        .then(data => {
            if(data) {
                req.data = data;
                next();
            } else {
                res.status(404).json({message: "data not found"});
            }
        })
        .catch(err => {
            res.status(500).json({message: 'error retrieving data'})
        })
}

function validateBody(req, res, next){

    if(!req.body){
        res.status(400).json({message: 'missing data'})
    } else if (!req.body.name || !req.body.description) {
        res.status(400).json({message: 'missing data field'})
    } else if (req.body.completed !== undefined){
        req.body.complete = !!Number(req.body.completed);
    }

    next();
}

module.exports = router;