const express = require('express');
const router = express.Router();
const { mangaSchema } = require("../models/mangaDetails");
const MangaDetails = require("../models/mangaDetails");
const xss = require('xss');
const serialize = require('serialize-javascript');
const bcrypt = require('bcrypt');

const isAdmin = (req, res, next) => {
    try{
    if (req.session.userRole !== 'admin') {
        return res.status(403).send({ message: "Access Forbidden: Not an admin" });
        next(); 
    }
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ message: "Access Forbidden: Not an admin" });
    }
    
};


// Admin - Add Details
router.post('/', async (req, res) => {
    try {
<<<<<<< HEAD
        //Destructure and sanitize user inputs
        const { title, author, demographic, genre, synopsis, image, description } = req.body;
        const sanitizedTitle = xss(title);
        const sanitizedAuthor = xss(author);
        const sanitizedDemographic = xss(demographic);
        const sanitizedGenre = xss(genre);
        const sanitizedSynopsis = xss(synopsis);
        const sanitizedImage = xss(image);
        const sanitizedDescription = xss(description);

        //manga object with sanitized inputs
        const newManga = new MangaDetails({
            title: sanitizedTitle,
            author: sanitizedAuthor,
            demographic: sanitizedDemographic,
            genre: sanitizedGenre,
            synopsis: sanitizedSynopsis,
            image: sanitizedImage,
            description: sanitizedDescription
=======
        const { title, author, demographic, genre, image, description } = req.body;
        
        
        const newManga = new MangaDetails({
            title,
            author,
            demographic,
            genre,
            image,
            description
>>>>>>> 13aa944ab9e6f40834c247a145234420ed806acd
        });

        // Save the manga details to the database
        const savedManga = await newManga.save();

        // Respond with the saved manga details
        res.status(201).json(savedManga);
    } catch (err) {
        // Handle errors
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});




// Admin - UpdateDetails
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
<<<<<<< HEAD
        const { title, author, demographic, genre, synopsis, image, description } = req.body;

=======
        const { title, author, demographic, genre, image, description } = req.body;
        console.log(id);
        
>>>>>>> 13aa944ab9e6f40834c247a145234420ed806acd
        
        let manga = await MangaDetails.findById(id);
        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

<<<<<<< HEAD
        // manga details here but they are untouchable
        manga.title = xss(title);
        manga.author = xss(author);
        manga.demographic = xss(demographic);
        manga.genre = xss(genre);
        manga.synopsis = xss(synopsis);
        manga.image = xss(image);
        manga.description = xss(description);
=======
        manga.title = title;
        manga.author = author;
        manga.demographic = demographic;
        manga.genre = genre;
        manga.image = image;
        manga.description = description;
>>>>>>> 13aa944ab9e6f40834c247a145234420ed806acd

        
        const updatedManga = await manga.save();

        
        res.json(updatedManga);
    } catch (err) {
        
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});



//Users - SearchDetails
router.get('/title/:title', async (req, res) => {
    try {
        const sanitizedTitle = xss(req.params.title);
        title.push(sanitizedTitle);
        res.redirect('/')
        console.log(sanitizedTitle);
        
        const manga = await MangaDetails.findOne({ title: sanitizedTitle });

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }
        const serializedManga = serialize(manga);
        res.setHeader('Content-Type', 'application/json'); 
        res.status(200).send(serializedManga);
        res.json(manga);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - Get Details by Id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const manga = await MangaDetails.findById(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - get all manga
router.get('/', async (req, res) => {
    try {
        
        const manga = await MangaDetails.find({});

        if (!manga) {
            return res.status(404).json({ message: "No Manga" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Admin - DeleteDetails
router.delete('/:id', isAdmin, async (req, res) =>{
    try {
        const id = req.params.id;
        
        const manga = await MangaDetails.findByIdAndDelete(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({message: "Unable to delete manga"})
    }
})

module.exports = router;
