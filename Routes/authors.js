const express = require("express");
const Joi = require("joi");
const router = express.Router();

const authors = [
  {
    id: 1,
    firstName: "karim",
    lastName: "brahimi",
    nationality: "algeria",
    image: "default-img.png",
  },
  {
    id: 2,
    firstName: "shin",
    lastName: "nozen",
    nationality: "lucia",
    image: "default-img.png",
  },
];
/**
 * @desc  get all authors
 * @route /api/books
 * @method get
 * @access public
 *
 **/

router.get("/", (req, res) => {
  res.json(authors);
});

/**
 * @desc  get author by id
 * @route /api/books
 * @method get
 * @access public
 *
 **/
router.get("/:id", (req, res) => {
  const AuthorID = req.params.id;
  const author = authors.find((author) => author.id === parseInt(AuthorID));
  if (!author) {
    res.status(404).json({ message: "author not found" });
  }
  res.status(200).json(author);
});

/**
 * @desc  create an author
 * @route /api/books
 * @method post
 * @access public
 *
 **/
router.post("/", (req, res) => {
  const { error } = validateAuthorCreation(req.body);

  if (error) {
    res.status(400).json(error.details[0].message);
  }
  else{
    const author = {
      id: authors.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: "default-img.png",
    };
    authors.push(author);
    res.status(202).json(author);
  }
  
});

/**
 * @desc  update an author
 * @route /api/books
 * @method put
 * @access public
 *
 **/

router.put("/:id", (req, res) => {
  const { error } = validateAuthorUpdate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
  }

  const authorId = parseInt(req.params.id);
  const author = authors.find((author) => author.id === authorId);
  if (!author) {
    res.status(404).json({ message: "author not found" });
  }
  res.status(200).json({ message: "author was updated" });
});

/**
 * @desc  delete an author
 * @route /api/books
 * @method delete
 * @access public
 *
 **/

router.delete("/:id",(req,res)=>{

  const authorId = parseInt(req.params.id);
  const author = authors.find((author) => author.id === authorId);
  if (!author) {
    res.status(404).json({ message: "author not found" });
  }
  res.status(200).json({ message: "author was delted" });

})
// functions
function validateAuthorCreation(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(5).max(200).required(),
    lastName: Joi.string().trim().min(3).max(200).required(),
    nationality: Joi.string().trim().min(3).max(200).required(),
    // image: Joi.string().trim().min(3).max(200).required(),
  });
  return ({ error } = schema.validate(obj));
}

function validateAuthorUpdate(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(5).max(200),
    lastName: Joi.string().trim().min(3).max(200),
    nationality: Joi.string().trim().min(3).max(200),
    // image: Joi.string(),
  });
  return ({ error } = schema.validate(obj));
}
module.exports = router;
