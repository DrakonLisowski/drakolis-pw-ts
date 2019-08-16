  // compresses requests
import session from 'express-session';

// Create Express server
const app = express();

/*
// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true} ).then(
    () => {},
).catch((err) => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    // process.exit();
});
*/

// Express configuration
app.set('port', process.env.PORT || 8080);
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: SESSION_SECRET,
//   store: new MongoStore({
//       url: mongoUrl,
//       autoReconnect: true,
//   }),
// }));

export default app;
