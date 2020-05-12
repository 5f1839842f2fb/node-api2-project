const express = require('express')
const router = express.Router()
const db = require('../data/db.js')



router.post('/', (req, res) => {
  if ("title", "contents" in req.body) {
    db.insert(req.body)
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).json({ error: "There was an error while saving the post to the database" }))
  } else {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
})

router.post('/:id/comments', (req, res) => {
  let postById;
  db.findById(req.params.id).then(response => {
    postById = response
    if (postById.length > 0) {
      if ("text", "post_id" in req.body) {
        if (req.body.post_id === req.params.id.toString()) {
          db.insertComment(req.body)
          .then(response => res.status(201).send(response))
          .catch(error => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
        } else {
          res.status(400).json({  message: "post_id must match the post you are submitting a comment to"})
        }
      } else {
        res.status(400).json({ errorMessage: "Please provide text and post id for the comment." })
      }
    } else {
      res.status(400).json({ message: "The post with the specified ID does not exist." })
    }
  })
})

router.get('/', (req, res) => {
  db.find()
  .then(response => res.status(200).send(response))
  .catch(error => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

router.get('/:id', (req, res) => {
  db.findById(req.params.id)
  .then(response => {
    if (response.length > 0) {
      res.status(200).send(response[0])
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The post information could not be retrieved." })
  })
})

router.get('/:id/comments', (req, res) => {
  db.findById(req.params.id)
  .then(response => {
    if (response.length > 0) {
      db.findPostComments(req.params.id)
      .then(response => {
        res.status(200).send(response)
      })
      .catch(error => {
        res.status({ error: "The comments information could not be retrieved." })
      })
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The post information could not be retrieved." })
  })
})

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(response => {
    res.status(200).send(`post with id ${req.params.id} deleted`)
    console.log(response)
  })
  .catch(error => {
    res.status(500).json({ message: "The post with the specified ID does not exist." })
  })
})

router.put('/:id', (req, res) => {
  db.findById(req.params.id)
  .then(response => {
    if (response.length > 0) {
      if("title", "contents" in req.body) {
        db.update(req.params.id, req.body)
        .then(() => {
          db.findById(req.params.id)
          .then(response => res.status(200).send(response))
        })
      }
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  
})

module.exports = router