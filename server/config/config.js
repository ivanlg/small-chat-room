const dotenv = require('dotenv');

dotenv.config();

// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3003;

// ============================
//  Evn
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  DB
// ============================

let DBURI;

if (process.env.NODE_ENV === 'dev') {
  DBURI = 'mongodb://localhost/small_chat_room';
} else {
  DBURI = process.env.DATABASE_URI;
}

process.env.DBURI = DBURI;

// ============================
//  Google Sign In CLIENT_ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '417472594897-02t30jo2a9d2stkrgl4ua93001mjdrnk.apps.googleusercontent.com';
