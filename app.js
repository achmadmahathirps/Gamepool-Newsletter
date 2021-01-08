const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

const server = express();

server.use(express.static("public"));
server.use(bodyParser.urlencoded({extended:true}));

server.listen(process.env.PORT || 3000, function(){
    console.log("Server berjalan di port 3000");
});

server.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

server.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us2.api.mailchimp.com/3.0/lists/d88676d35b";
    const options = {
        method: "POST",
        auth: "mahathir1:f1dccc420909fc3b577f6b5a38628c95-us2"
    }

    //proses utama get/post, proses error handling juga.
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

server.post("/failure", function(req, res){
    res.redirect("/");
});

// api key : f1dccc420909fc3b577f6b5a38628c95-us2

// List ID : d88676d35b