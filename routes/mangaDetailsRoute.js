const express = require('express');
const session = require('express-session');
const router = express.Router();
const { mangaSchema } = require("../models/mangaDetails");
const MangaDetails = require("../models/mangaDetails");
const xss = require('xss');
const serialize = require('serialize-javascript');


const isAdmin = (req, res, next) => {
    try {
        console.log("ROLE ", req.session.userRole);
        if (req.session.userRole !== 'admin') {
            return res.status(403).send({ message: "Access Forbidden: Not an admin" });
            
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ message: "Access Forbidden: Not an admin" });
    }

};


// Admin - Add Details
router.post('/', isAdmin, async (req, res) => {
    try {
        //Destructure and sanitize user inputs
        const { title, author, demographic, genre, synopsis, image, description } = req.body;
        console.log(title, author, demographic, genre, image, description);
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
        const { title, author, demographic, genre, image, description } = req.body;
        console.log(id);


        let manga = await MangaDetails.findById(id);
        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        // manga details here but they are untouchable
        manga.title = xss(title);
        manga.author = xss(author);
        manga.demographic = xss(demographic);
        manga.genre = xss(genre);
        manga.image = xss(image);
        manga.description = xss(description);


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
        console.log(sanitizedTitle);

        const manga = await MangaDetails.findOne({ title: sanitizedTitle });

        if (!manga) {
            return res.status(404).json({ message: "Manga not available" });
        }
        const serializedManga = serialize(manga);
        res.setHeader('Content-Type', 'application/json');
        res.json(manga);
        res.status(200).send(serializedManga);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - Get Details by Id
router.get('/id/:id', async (req, res) => {
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
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        const manga = await MangaDetails.findByIdAndDelete(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: "Unable to delete manga" })
    }
})

module.exports = router;
