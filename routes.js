/*================================================*/
/*          Matt's default Node Server            */
/*================================================*/

/*----------Import Modules----------*/
const path = require('path');
const characters = require("./characters.json");

/*----------Export File----------*/
module.exports = function(app) {

    app.route('/')
        .get(home); //user has accessed homepage
    app.route("/character")
        .get(getCharacter)
        .post(pythonPost);

}

/*----------Endpoint Functions----------*/
function home(req, res) {
    //send homepage html
    res.sendFile(path.join(__dirname + '/index.html'));
}

function getCharacter(req, res) {
    var query = req.query;
    var category = query.category || "enemy"

    var list = characters[category];

    var character = (query.name)? list[query.name] : getRandomElement(list);

    res.json(character);
}

function pythonPost(req, res) {
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["./character.py"]);
    process.stdout.on('data', function(data) {
      obj = JSON.parse(data);
      characters[obj.category][obj.name] = obj;
      res.send("Successfully added character from python file");
    })
}

function getRandomElement(obj) {
    var key = Object.keys(obj)[Math.floor(Math.random() * len(obj))];
    return obj[key];
}

function len(obj) {
    return Object.keys(obj).length;
}
