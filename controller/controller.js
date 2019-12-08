const express = require("express");
const path = require("path");


const axios = require("axios");
const cheerio = require("cheerio");

const Comment = require("../models/Comment");
const Article = require("../models/Article");

const app = express();


app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.theonion.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article a").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .attr("text");
      result.link = $(this)
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

app.get("/", function(req, res) {
    res.redirect("/articles");
});

app.get("/articles", function(req, res) {
    Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});



