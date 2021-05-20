import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

import Book from '../models/Book.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('Books', () => {
  // empty test database before each test
  beforeEach((done) => {
    Book.collection.drop({}, (err) => {
      done();
    });
  });

  // Test the /GET route

  describe('GET Books', () => {
    it('Should return array of books', (done) => {
      chai
        .request(app)
        .get('/books')
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          done();
        });
    });
  });

  // Test the /POST route

  describe('POST Book', () => {
    it('It should POST a book', (done) => {
      let book = { title: 'Learn JavaScript', author: 'John Doe', rating: 5 };
      chai
        .request(app)
        .post('/books')
        .send(book)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          );
          done();
        });
    });

    // test validation
    it('It should not POST a book - validation errors', (done) => {
      let book = { title: 555, author: 23, rating: 'five' };
      chai
        .request(app)
        .post('/books')
        .send(book)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          );
          done();
        });
    });
  });

  // Test the /PUT/:id route

  describe('/PUT/id books', () => {
    it('It should UPDATE a book', (done) => {
      let book = new Book({
        title: 'Learn JavaScript',
        author: 'John Doe',
        rating: 5,
      });
      book.save((err, book) => {
        chai
          .request(app)
          .put(`/books/${book.id}`)
          .send({ title: 'Learn Testing', author: 'Paul Matei', rating: 4 })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res).to.have.header(
              'content-type',
              'application/json; charset=utf-8'
            );
            expect(res.body).to.have.property('title').eql('Learn Testing');
            expect(res.body).to.have.property('author').eql('Paul Matei');
            expect(res.body).to.have.property('rating').eql(4);
            done();
          });
      });
    });

    // test validation
    it('It should not UPDATE a book - show validation errors', (done) => {
      let book = new Book({
        title: 'Learn JavaScript',
        author: 'John Doe',
        rating: 5,
      });
      book.save((err, book) => {
        chai
          .request(app)
          .put(`/books/${book.id}`)
          .send({ title: 12, author: 34, rating: 'abcd' })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(400);
            expect(res.body).to.be.a('object');
            expect(res).to.have.header(
              'content-type',
              'application/json; charset=utf-8'
            );
            done();
          });
      });
    });

    it('It should not DELETE a book if book not found', (done) => {
      chai
        .request(app)
        .put('/books/60a50065a336a564c657ebd5')
        .send({ title: 'Book Title', author: 'Some Authro', rating: 3 })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          );
          expect(res.body).to.have.property('message').eql('Book not found');
          done();
        });
    });
  });

  // test the delete route

  describe('/DELETE/id books', () => {
    it('It should DELETE a book', (done) => {
      let book = new Book({
        title: 'Learn JavaScript',
        author: 'John Doe',
        rating: 4,
      });
      book.save((err, book) => {
        chai
          .request(app)
          .delete(`/books/${book.id}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('string');
            expect(res).to.have.header(
              'content-type',
              'application/json; charset=utf-8'
            );
            done();
          });
      });
    });

    // check 404
    it('It should not DELETE a book if book not found', (done) => {
      chai
        .request(app)
        .delete('/books/60a50065a336a564c657ebd5')
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          );
          expect(res.body).to.have.property('message').eql('Book not found');
          done();
        });
    });

    it('It should not DELETE if id is not in correct mongo format (ObjectId)', (done) => {
      chai
        .request(app)
        .delete('/books/12345a6-wrong-format')
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          );
          expect(res.body)
            .to.have.property('message')
            .eql('Id is not a mongo Object_Id');
          done();
        });
    });
  });
});
