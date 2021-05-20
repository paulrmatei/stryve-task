import express from 'express';
import mongoose from 'mongoose';

import Book from '../models/Book.js';
import { validate, validationRules } from '../utils/validator.js';

const router = express.Router();

const { isValidObjectId } = mongoose;

// @route GET /books
// @desc  Get all books

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send({ books });
  } catch (error) {
    res.status(500).json('Server Error');
  }
});

// @route POST /books
// @desc create a book

router.post('/books', validationRules(), validate, async (req, res) => {
  const { title, author, rating } = req.body;

  try {
    const newBook = new Book({ title, author, rating });
    const book = await newBook.save();

    res.send(book);
  } catch (error) {
    res.status(500).json('Server Error');
  }
});

// @route PUT /books
// @desc update a book

router.put('/books/:id', validationRules(), validate, async (req, res) => {
  // check id is a valid mongo Object Id
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Id is not a mongoose Object_Id' });
  }

  // checking if request body is empty -
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Request body is empty' });
  }

  const { title, author, rating } = req.body;

  // Build book object
  const bookFields = {};

  if (title) bookFields.title = title;
  if (author) bookFields.author = author;
  if (rating) bookFields.rating = rating;

  try {
    // check if book exists in the database
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // if book found, update it
    book = await Book.findByIdAndUpdate(
      req.params.id,
      bookFields,
      (error, result) => {
        if (error) return res.status(500).json(error.message);
        return result;
      }
    );

    res.send(book);
  } catch (error) {
    res.status(500).json('Server Error');
  }
});

// @route DELETE /books
// @desc delete a book

router.delete('/books/:id', async (req, res) => {
  // check id is a valid mongo Object Id
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Id is not a mongo Object_Id' });
  }

  try {
    // check if book exists in the database
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // if book found, delete it
    Book.findByIdAndRemove(req.params.id, (error, doc) => {
      if (error) {
        res.status(400).json(error.message);
      } else {
        res.json('Book deleted');
      }
    });
  } catch (error) {
    res.status(500).json('Server Error');
  }
});

export default router;
