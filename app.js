const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const pageRouter = require('./routes/page');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
app.use(flash()); //cookieParser, session 뒤에 위치해야 함. 일회성 메시지들을 웹 브라우저에 나타낼 때 용이함.

app.use('/', pageRouter);

/**
 * 404 Not Found 미들웨어
 * 이 위에 라우터에서 라우팅되지 않는 요청은 여기를 지나간다.
 */
app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

/**
 * 에러 핸들러
 */
app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
   console.log(app.get('port'), ' 번 포트에서 대기 중');
});
