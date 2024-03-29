const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.redirect('/guest/hu');
});

app.get("/encoder", async (req, res) => {
    var startTime = Date.now();
    var stopTime = Date.now();
    res.render('encoder', { time: stopTime - startTime });
});

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

app.get('/loadList/:list/:lang', async (req, res) => {
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
    res.render(req.params.lang + '-list', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
    fs.appendFileSync('log.txt', `[MEGNYITÁS] Egy felhasználó megnyitotta a listát. (${req.params.list.replace(".txt","")})  ${new Date().toISOString()} ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}\n`);
})

app.get('/writeList/:list/:lang', async (req, res) => {
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
    res.render(req.params.lang + '-writeList', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
})

app.get('/viewList/:list/:lang', async (req, res) => {
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
    res.render(req.params.lang + '-viewer', {listname: req.params.list.replace(".txt",""), time: time, questionArray: questionArray, answerArray: answerArray });
})


app.get('/:jwt/:lang', async (req, res) => {
    const lang = req.params.lang;
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
    switch (lang) {
        case "hu":
            var lists = "<table><tr><th>Lista neve</th><th></th><th></th><th></th></tr>";
            break;
        case "en":
            var lists = "<table><tr><th>List</th><th></th><th></th><th></th></tr>";
            break;
        default:
            var lists = "<table><tr><th>Lista neve</th><th></th><th></th><th></th></tr>";
            break;
    }
    files.forEach(file => {
        switch (lang) {
            case "hu":
                lists += `<tr><td><a href="/rawList/${file}">${file.replace(".txt","")}</a></td><td><a href="/loadList/${file}/${lang}">Kártya</a></td><td><a href="/writeList/${file}/${lang}">Írás</a></td><td><a href="/viewList/${file}/${lang}">Nézegető</a></td></tr>`
                break;
            case "en":
                lists += `<tr><td><a href="/rawList/${file}">${file.replace(".txt","")}</a></td><td><a href="/loadList/${file}/${lang}">Cards</a></td><td><a href="/writeList/${file}/${lang}">Write</a></td><td><a href="/viewList/${file}/${lang}">Viewer</a></td></tr>`
                break;
            default:
                lists += `<tr><td><a href="/rawList/${file}">${file.replace(".txt","")}</a></td><td><a href="/loadList/${file}/${lang}">Kártya</a></td><td><a href="/writeList/${file}/${lang}">Írás</a></td><td><a href="/viewList/${file}/${lang}">Nézegető</a></td></tr>`
                break;
        }
    });
    var stopTime = Date.now();
    var time = stopTime - startTime;
    if (req.params.jwt == "guest") {
        console.log("[MEGNYITÁS] A felhasználó megnyitotta a listákat.", "guest");
        fs.appendFileSync('log.txt', `[MEGNYITÁS] A felhasználó megnyitotta a listákat. (guest)  ${new Date().toISOString()} ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}\n`);
    } else {
        fs.appendFileSync('log.txt', `[MEGNYITÁS] A felhasználó megnyitotta a listákat. (${decoded.username})  ${new Date().toISOString()} ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}\n`);
    }
    res.render(lang + '-lists', { lists: lists, time: time });
});

app.listen(port, () => {
    console.log(`Kész! (port: ${port})`);
});
