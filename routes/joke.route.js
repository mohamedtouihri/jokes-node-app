const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joke = require('../models/joke.model');

// Create a new joke
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const joke = new Joke({
        ...req.body,
        author: req.user._id, // Associate joke with authenticated user
      });
      const savedJoke = await joke.save();
      res.status(201).json(savedJoke);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all jokes
router.get('/', async (req, res) => {
  try {
    const jokes = await Joke.find();
    res.json(jokes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jokes by authenticated user
router.get(
  '/myjokes',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const jokes = await Joke.find({ author: req.user._id });
      res.json(jokes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get a specific joke by ID
router.get('/:id', async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (joke) {
      res.json(joke);
    } else {
      res.status(404).json({ message: 'Joke not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a joke
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const joke = await Joke.findById(req.params.id);
      if (!joke) {
        return res.status(404).json({ message: 'Joke not found' });
      }

      // Check if user owns the joke
      if (joke.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'Not authorized to update this joke' });
      }

      const updatedJoke = await Joke.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.json(updatedJoke);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a joke
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const joke = await Joke.findById(req.params.id);
      if (!joke) {
        return res.status(404).json({ message: 'Joke not found' });
      }

      // Check if user owns the joke
      if (joke.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'Not authorized to delete this joke' });
      }

      await joke.deleteOne();
      res.json({ message: 'Joke deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
