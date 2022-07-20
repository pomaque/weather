const request = require("request");
const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const moment = require('moment-timezone');
const cron = require("node-cron");
const app = express();

const dateTurkey = moment.tz("Europe/Istanbul").format();

mongoose.connect("mongodb://localhost:27017/TempDB", (err) => {
  if (err) console.log(err);
});

//#region MongooseModel
const TempSchema = new mongoose.Schema({
  city: { type: String },
  norMin: { type: Number },
  norMax: { type: Number },
  absMin: { type: Number },
  absMax: { type: Number },
  createdAt: { type: String, default: dateTurkey },
});
const Temps = mongoose.model("Temp", TempSchema);
//#endregion

//#region Cities
const izmir = 
  "https://tr.weatherspark.com/td/94320/%C4%B0zmir-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn" //"http://localhost:3000/test";

const istanbul =
  "https://tr.weatherspark.com/td/95434/%C4%B0stanbul-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn";
const ankara =
  "https://tr.weatherspark.com/td/97345/Ankara-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn";
const bursa =
  "https://tr.weatherspark.com/td/96052/Bursa-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn";
//#endregion

// cron.schedule("*/1 * * * *", () => {
  getDegree(izmir);
  getDegree(istanbul);
  getDegree(ankara);
  getDegree(bursa);
// });

function getDegree(cityURL) {
  let randomHeaders = ["Emre", "Erbek", "Adamdir"];
  let rng = Math.floor(Math.random() * randomHeaders.length);
  request.get(
    {
      url: cityURL,
      headers: {
        "User-Agent": randomHeaders[rng],
      },
    },
    (err, res, body) => {
      if (err) console.log(err);

      let start = body.indexOf('<meta name="description" content="');
      let end = body.indexOf('">', start);
      let fullText = body.substring(start, end);
      let fullTextSplit = fullText.split(" ");
      let temps = [];

      for (i = 0; i < fullTextSplit.length; i++) {
        if (fullTextSplit[i].indexOf("°C") > -1) {
          temps.push(fullTextSplit[i].replace("°C", "") * 1);
        }
      }
Temps.create({
          city: fullTextSplit[6],
          norMin: temps[0],
          norMax: temps[1],
          absMin: temps[2],
          absMax: temps[3],
        })


console.log(fullTextSplit[6] + " " + temps);
    }
  );
  //console.log(dateTurkey)
  // process.exit();
}

// //Header test
// app.get("/test", function (req, res, next) {
//   console.log(req.headers);
// });

// var port = 3000
// app.listen(port, ()=>{
//     console.log(`Server is running on ${port}`)
// });
