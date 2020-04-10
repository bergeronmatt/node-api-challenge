//initialise express object
const express = require('express');

//set up router objects
const router = express.Router();
const projectsMethod = require ('../data/helpers/projectModel');

//endpoints

router.get('/', (req, res) => {
    projectsMethod.get()
    .then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "projects not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error getting projects" });
    });
})

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.data);
})

router.post('/', validateBody, (req, res) => {
    projectsMethod.insert(req.body)
    .then(result => {
        if (result) {
            res.status(200).json(result);
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error" });
    });
})

router.put('/:id', validateId, validateBody, (req, res) => {
    projectsMethod.update(req.params.id, req.body)
    .then(result => {
        if (result) {
            res.status(200).json(result);
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error" });
    });
})

router.delete('/:id', validateId, (req, res) => {
    projectsMethod.remove(req.params.id)
    .then(result => {
        if (result) {
            res.status(200).json(req.data);
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error" });
    });
})

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