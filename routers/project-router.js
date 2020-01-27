const express = require('express')

const projectDb = require('../data/helpers/projectModel')

const router = express.Router()

// GET: Retrieve all projects
router.get('/', (req, res) => {
  projectDb.get()
    .then((projects) => {
      res.status(200).json(projects)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "The projects could not be retrieved."})
    })
})

//GET: Retrieve a project by ID
router.get('/:id', validateProjectID, (req, res) => {
  projectDb.get(req.params.id)
    .then((project) => {
      res.status(200).json(project)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "The project could not be retrieved."})
    })
})

// POST: Create new Project
router.post('/', (req, res) => {

  if (req.body.name && req.body.description) {
    projectDb.insert(req.body)
      .then((newProject) => {
        res.status(201).json(newProject)
      }) 
      .catch(() => {
        res.status(500).json({ errorMessage: "Error, new project was not created"})
      })
  } else {
    res.status(400).json({ errorMessage: "Name and Description fields required" })
  }
})

// DELETE: Remove a project
router.delete('/:id', validateProjectID, (req, res) => {
  projectDb.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Project has been deleted" })
    })
})

//PUT: Update a project
router.put('/:id', validateProjectID, (req, res) => {
  if (req.body.name && req.body.description) {
    projectDb.update(req.params.id, req.body)
      .then(updatedProject => {
        projectDb.get(req.params.id)
          .then(() => {
            res.status(201).json(updatedProject)
          })
      })
      .catch(() => {
        res.status(500).json({ errorMessage: "The project information could not be updated."})
      })  
  } else {
    res.status(400).json({ errorMessage: "Name and Description fields required" })
  }
})

// Middleware

function validateProjectID(req, res, next) {
  const id = req.params.id

  projectDb.get(id)
    .then((project) => {
      if (project) {
        next();
      } else {
        res.status(404).json({ message: "Invalid Project ID" })
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "The project information could not be retrieved."})
    })
}

module.exports = router