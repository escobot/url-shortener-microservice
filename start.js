const mongoose = require('mongoose');
const app = require('./server');
const port = process.env.PORT || 3000;

const url = 'mongodb://root:rootpassword@mongo:27017/url_shortener?authSource=admin&compressors=zlib&retryWrites=true&w=majority';

const start = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false, 
            useCreateIndex: true 
        });
        console.log('Connected to MongoDB.')
    } catch(err) {
        console.error(err);
    }

    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
};

start();