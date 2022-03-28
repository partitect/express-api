const PORT = 8900

const express = require('express')
const axios = require("axios")
const cheerio = require("cheerio")
const res = require('express/lib/response')

const app = express()

const articles = [];
const weeks = [];
const teams = [];

app.get('/api', (req,res)=>{
    res.json("Welcome to my football api")
})

app.get("/news",(req,res)=>{
    axios.get('https://www.tff.org/default.aspx?pageID=198')
    .then((response=>{
        const html = response.data
        //console.log(html)
        const $ = cheerio.load(html)

        $('.belirginYazi',html).each(function(){
            const week = $(this).text();
            const homeTeam = $(this).parent().parent().children("tr").children("td").children("table").children("tbody").children("tr").children("td:first").text()

            const homeTeamScore = $(this).parent().parent().children("tr").children("td").children("table").children("tbody").children("tr").children("td:nth-child(2)").text().split(" - ")[0]

            const awayTeamScore = $(this).parent().parent().children("tr").children("td").children("table").children("tbody").children("tr").children("td:nth-child(2)").text().split(" - ").pop()

            const awayTeam = $(this).parent().parent().children("tr").children("td").children("table").children("tbody").children("tr").children("td:nth-child(2):first").next().text()

            articles.push({
                week,
                homeTeam,
                homeTeamScore,
                awayTeamScore,
                awayTeam
            })
           
        })
        res.setHeader("Content-Type", "application/json; charset=utf-8");

        res.json(articles)
    })).catch((err)=> console.log("err"))
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });