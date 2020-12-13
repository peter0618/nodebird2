const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
    // req.session 객체에 어떤 데이터를 저장할 지 선택합니다.
    passport.serializeUser((user,done) => {
       done(null, user.id); // req.session 에 사용자의 id 만 저장합니다.
    });

    // 매 요청 시 실행됩니다.
    passport.deserializeUser((id, done) => {
        User.findOne({where: {id}})
            .then(user => done(null, user)) // passport.serializeUser 를 통해서 저장했던 id 로 DB 에 저장되어있는 사용자 정보를 조회하여 req.user 객체에 셋팅합니다.
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
}
