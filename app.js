var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 使用SQLIE3 操作數據庫 打開在db/ssd_sqlite.db的資料庫並確認是否成功打開
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the ssd_sqlite database.');
    }
});
// 用get在/api/all_price取得所有資料
app.get('/api/all_price', (req, res) => {
    db.all('SELECT * FROM phone_price', (err, rows) => {
        if (err) {
            console.error(err.message);
        } else {
            res.send(rows);
        }
    });
});
// 用post 在/api/search_price取得特定資料
app.post('/api/search_price', (req, res) => {
    let name = req.body.date;
    db.all(`SELECT * FROM phone_price WHERE date =?  `, name ,(err, rows) => {
        if(err) {
            res.status(500).json({error:err.message});
            return;
        } else {
            res.json(rows);
        }
    });
});
module.exports = app;
