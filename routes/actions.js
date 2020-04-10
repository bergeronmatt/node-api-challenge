
//initialise express object

const express = require('express');

//set up router objects
const router = express.Router();
const actionMethod = require('../data/helpers/actionModel');
const projectMethod = require('../data/helpers/projectModel');

//endpoints

router.get('/', (req, res) => {
    actionMethod.get()
    .then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "actions not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "error getting actions" });
    });
})

router.get('/:id', validateId, (req, res) => {
    res.status(200).json(req.data)
})

router.post('/', validateBody, validateProjectId, (req, res) => {
    Actions.insert(req.body)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
})

router.put('/:id', validateBody, validateId, validateProjectId, (req, res) => {
    Actions.update(req.params.id, req.body)
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
    Actions.remove(req.params.id)
		.then(result => {
			if (result) {
				res.status(200).json(req.data);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
})



/** Custom Middleware */

function validateId(req, res, next) {
    actionMethod.get(req.params.id)
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

function validateProjectId(req, res, next){
    projectMethod.get(req.params.id)
        .then(project => {
            if(project){
                req.project = project
                res.status(201).json({project})
                next()
            } else {
                res.status(400).json({message: 'invalid project id'})
            }
        })
        .catch(err =>{
            res.stauts(500).json({errorMessage: 'Something went wrong'})
        })
}

function validateBody(req, res, next){

    if(!req.body){
        res.status(400).json({message: 'missing data'})
    } else if (!req.body.notes || !req.body.description) {
        res.status(400).json({message: 'missing data field'})
    } else if (req.body.description.length > 128){
        res.status(400).json({message: 'description too long'})
    } else if (req.body.completed !== undefined){
        req.body.complete = !!Number(req.body.completed);
    }

    next();
}


module.exports = router; 