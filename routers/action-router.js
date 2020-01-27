const express = require('express')
const projectDb = require('../data/helpers/projectModel')
const actionDb = require('../data/helpers/actionModel')

const router = express.Router()

// GET: Retrieve actions
router.get('/:id/actions', validateProjectId, (req, res) =>{
  projectDb.getProjectActions(req.params.id)
    .then((actions) => {
      res.status(200).json(actions)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Actions information could not be retrieved" })
  })
})

// POST: Create a new action
router.post('/:id/actions', validateProjectId, (req, res) => {
  if(req.body.notes && req.body.description) {
    actionDb.insert({ project_id: req.params.id, ...req.body })
      .then((newAction) => {
        res.status(201).json(newAction)        
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "Error, new project was not created"})
      })
  } else {
    res.status(400).json({ errorMessage: "Notes and Description fields required" })    
  }
})

// DELETE
router.delete('/:id/actions/:actionID', validateActionId, validateProjectId, (req, res) => {
  actionDb.remove(req.params.actionID)
    .then(() => {
      res.status(200).json({ message: "Action successfully deleted" });
    })
    .catch(() => {
      res.status(500).json({ message: "Error deleting action" });
    })
})

// PUT: Update Action
router.put('/:id/actions/:actionID', validateActionId, validateProjectId, (req, res) => {
  if (req.body.notes && req.body.description) {
    actionDb.update(req.params.actionID, req.body)
      .then((action) => {
        res.status(201).json(action);
      })
      .catch(() => {
        res.status(500).json({ message: "Error updating action" });
      })
  } else {
    res.status(400).json({ errorMessage: "Notes and Description fields required" })
  }
})

// Middleware
function validateActionId(req, res, next) {
  const { actionID } = req.params

  actionDb.get(actionID)
    .then((action) => {
      if (action) {
        next()
      } else {
        res.status(404).json({ errorMessage: "Invalid action id" })
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The action information could not be retrieved." })
  })    
}

function validateProjectId(req, res, next) {
  const { id } = req.params

  projectDb.get(id)
    .then((project) => {
      if (project) {
      next()
      } else {
        res.status(404).json({ message: "invalid project id" })
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The project information could not be retrieved." })
  })
}

module.exports = router