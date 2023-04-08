let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


// Раздача статики
app.use(express.static(`public`));


// Настройка handlebars
const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/itube');

// Схемы
let videoSchema = new mongoose.Schema({
    title: String,
    author: String,
    preview: String,
    likes: Number,
    youtube: String
})

let Video = mongoose.model('video', videoSchema);

let bloggerSchema = new mongoose.Schema({
    username: String,
    avatar: String,
    followers: Number
})

let Blogger = mongoose.model('blogger', bloggerSchema);

// Роуты
app.get('/', async function(req, res) {
    let data = await Video
        .find()
        .sort({likes: -1})
        .limit(10);

    res.render('index', {
        array: data
    })
});

app.get('/video', async function(req, res) {
    let id = req.query.id;
    let data = await Video.findOne({_id: id});
    let array = await Video.find({author: data.author,
                                  _id: {$ne: data._id} }).limit(3);

    res.render('video', {
        video: data,
        array: array
    });
});

app.get(`/blogger`, async function (req, res) {
    let username = req.query.username;
    let data = await Blogger.findOne({username: username})
    let array = await Video.find({author: username})
                .sort({likes: -1});

    res.render('blogger', {
        blogger: data,
        array: array
    });

});