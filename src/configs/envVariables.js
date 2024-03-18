exports.SERVER_NAME = 'Theatrix7';
exports.PORT = 3000;
exports.DB_CONNECTION = `mongodb://127.0.0.1:27017/${this.SERVER_NAME}DB`;
exports.SALTS = 10; // default - 10
exports.SECRET = '!D!e09i 0n384,s-57vmay3985lhnd95lvn34957vbna738509yl-220fmwni';
exports.TOKEN_EXPIRATION = '150m';
exports.SESSION_COOKIE_NAME = 'user';
exports.USER_MIN_STRENGTH = 3;
exports.PASS_MIN_STRENGTH = 8;
exports.CITY_MIN_STRENGTH = 3;
exports.MAX_STRENGTH = 21;