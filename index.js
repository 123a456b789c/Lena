const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/:jwt', async (req, res) => {
    var startTime = Date.now();
    var decoded = ""
    try {
        decoded = jwt.verify(req.params.jwt, process.env.JWT_SECRET);
    } catch(err) {
        if (req.params.jwt != "guest") {
            console.log("[MEGNYITÁS] Hiba a token dekódolása közben. ", req.params.jwt)
            res.render('forbidden', { error: 'A token nem érvényes.' });
            return;
        }
    }
    var listDir = path.join(__dirname, 'lists');
    var files = fs.readdirSync(listDir);
    var lists = "<table><tr><th>Lista neve</th><th>Kártya</th><th>Irás</th><th>Nyers</th><th>Nézegető</th></tr>";
    files.forEach(file => {
        lists += `<tr><td>${file.replace(".txt","")}</td><td><a href="/loadList/${file}">Kártya</a></td><td><a href="/writeList/${file}">Írás</a></td><td><a href="/rawList/${file}">Nyers</a></td><td><a href="/viewList/${file}">Nézegető</a></td></tr>`
    });
    var stopTime = Date.now();
    var time = stopTime - startTime;
    if (req.params.jwt == "guest") {
        console.log("[MEGNYITÁS] A felhasználó megnyitotta a listákat.", "guest");
    } else {
    console.log("[MEGNYITÁS] A felhasználó megnyitotta a listákat.", decoded.username);
    }
    res.render('lists', { lists: lists, time: time });
});

app.get('/loadList/:list', async (req, res) => {
    var startTime = Date.now();
    var listDir = path.join(__dirname, 'lists');
    try {
    var list = fs.readFileSync(path.join(listDir, req.params.list), 'utf8');
    } catch(err) {
        res.render('invalid', { error: 'A lista nem létezik.' });
        return;
    }
    var listArray = list.split('\n');
    var questionArray = [];
    var answerArray = [];
    //console.log(listArray)
    listArray.forEach((item, index) => {
        questionArray.push(item.split('\t')[1]);
        answerArray.push(item.split('\t')[0]);
    });
    questionArray.forEach((item, index) => {
        if (questionArray[index] == "") {
            questionArray.splice(index, 1);
        }
        if (answerArray[index] == undefined) {
            answerArray.splice(index, 1);
        }
    });
    answerArray.forEach((item, index) => {
        if (answerArray[index] == "") {
            answerArray.splice(index, 1);
        }
        if (questionArray[index] == undefined) {
            questionArray.splice(index, 1);
        }
    });
    if (questionArray.length != answerArray.length) {
        res.render('invalid', { error: 'A listák nem ugyanolyan hosszúak az előműveletek után.' });
        return;
    }
    var stopTime = Date.now();
    var time = stopTime - startTime;
    res.render('list', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
})

app.get('/writeList/:list', async (req, res) => {
    var startTime = Date.now();
    var listDir = path.join(__dirname, 'lists');
    try {
    var list = fs.readFileSync(path.join(listDir, req.params.list), 'utf8');
    } catch(err) {
        res.render('invalid', { error: 'A lista nem létezik.' });
        return;
    }
    var listArray = list.split('\n');
    var questionArray = [];
    var answerArray = [];
    //console.log(listArray)
    listArray.forEach((item, index) => {
        questionArray.push(item.split('\t')[1]);
        answerArray.push(item.split('\t')[0]);
    });
    questionArray.forEach((item, index) => {
        if (questionArray[index] == "") {
            questionArray.splice(index, 1);
        }
        if (answerArray[index] == undefined) {
            answerArray.splice(index, 1);
        }
    });
    answerArray.forEach((item, index) => {
        if (answerArray[index] == "") {
            answerArray.splice(index, 1);
        }
        if (questionArray[index] == undefined) {
            questionArray.splice(index, 1);
        }
    });
    if (questionArray.length != answerArray.length) {
        res.render('invalid', { error: 'A listák nem ugyanolyan hosszúak az előműveletek után.' });
        return;
    }
    var stopTime = Date.now();
    var time = stopTime - startTime;
    res.render('writeList', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
})

app.get('/viewList/:list', async (req, res) => {
    var startTime = Date.now();
    var listDir = path.join(__dirname, 'lists');
    try {
    var list = fs.readFileSync(path.join(listDir, req.params.list), 'utf8');
    } catch(err) {
        res.render('invalid', { error: 'A lista nem létezik.' });
        return;
    }
    var listArray = list.split('\n');
    var questionArray = [];
    var answerArray = [];
    //console.log(listArray)
    listArray.forEach((item, index) => {
        questionArray.push(item.split('\t')[1]);
        answerArray.push(item.split('\t')[0]);
    });
    questionArray.forEach((item, index) => {
        if (questionArray[index] == "") {
            questionArray.splice(index, 1);
        }
        if (answerArray[index] == undefined) {
            answerArray.splice(index, 1);
        }
    });
    answerArray.forEach((item, index) => {
        if (answerArray[index] == "") {
            answerArray.splice(index, 1);
        }
        if (questionArray[index] == undefined) {
            questionArray.splice(index, 1);
        }
    });
    if (questionArray.length != answerArray.length) {
        res.render('invalid', { error: 'A listák nem ugyanolyan hosszúak az előműveletek után.' });
        return;
    }
    var stopTime = Date.now();
    var time = stopTime - startTime;
    res.render('viewer', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
})

app.get('/rawList/:list', async (req, res) => {
    var listDir = path.join(__dirname, 'lists');
    try {
    var list = fs.readFileSync(path.join(listDir, req.params.list), 'utf8');
    } catch(err)
    {
        res.render('invalid', { error: 'A lista nem létezik.' });
        return;
    }
    res.sendFile(path.join(listDir, req.params.list));
})



app.listen(port, () => {
    console.log(`Kész! (port: ${port})`);
});
