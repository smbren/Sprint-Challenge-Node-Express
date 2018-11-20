const express = require('express');

const actionModel = require('../data/helpers/actionModel');

const route = express.Router();

route.get('/', (req, res) => {
    actionModel.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.status(500).json({ message: 'Couldn\'t retrieve posts, please try again.'})
    })
})

route.get('/:id', (req, res) => {
    const {project_id} = req.params;
    actionModel.get(project_id)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        res.status(500).json({ message: 'Couldn\'t retrieve requested post.'})
    })
})

route.post('/', (req, res) => {
    const {project_id, description, notes} = req.body
    if( project_id.length === 0 || description.length === 0 || notes.length === 0) {
        return res.status(400).json({ error: 'A action id, description, and notes are required to submit a new action.'})
    } else {
        actionModel.insert({project_id, description, notes})
        .then(action => {
            res.status(200).json({message: 'complete'})
        })
        .catch(err => {
            res.status(500).json({ message: 'Unable to create a new action, please try again.'})
        })
    }
})

route.delete('/:id', (req, res) => {
    const {id} = req.params
    actionModel.remove(id)
    .then(count => {
        if( count === 0 ) {
            res.status(404).json({error: 'The action you requested does not exist'})
        } else {
            res.status(200).json
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Could not delete request action, please try again'})
    })
})

route.put('/:id', (req, res) => {
    const {id} = req.params
    const { notes, description, project_id } = req.body
    if(notes.length === 0 || description.length === 0 || project_id.length === 0) {
        return res.status(400).json({ message: 'Please include the changes you would like to make.'})
    }
    actionModel.update(id, {notes, description, project_id})
    .then( changes => {
        if (changes < 1) {
            return res.status(404).json({ error: 'The project you request does not exist'})
        }
        const updates = changes;
        res.status(200).json({message: updates})
    })
    .catch(err => {
        res.status(500).json({message: 'Unable to make the requested changes'})
    })
})


module.exports = route;