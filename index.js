const express = require('express')
const path = require('path')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(8080, () => console.log("server opening"))

//* mysql setup
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Amks94884674?',
    database: 'test'
});

//* working login
app.post('/info', (req, res) => {
    console.log(req.body)
    pool.query('select * from account where username = ?', [req.body.user], (err, results) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(results)
        res.send(results)
    })
})

//* upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./file', { recursive: true }, (err) => {
            if (err) {
                cb(err);
            } else {
                cb(null, './file');
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage })
app.post('/file', upload.single('file'), (req, res) => {
    console.log(req.headers['content-type'])
    console.log(req.file)
    res.send('work')
})

//* admin can add model to dir => client can download it
app.get('/reload', (req, res) => {
    promise()
        .then(result => res.send(result))
        .catch(err => res.send(err))
})
function promise() {
    return new Promise((resolve, reject) => {
        const file_path = './model'
        fs.readdir(file_path, (err, files) => {
            if (err) {
                reject(err)
                return
            }
            resolve(files)
        })
    })
}
app.get('/download/:filename', (req, res) => {
    console.log(req.params.filename)
    const filename = req.params.filename
    const path2file = path.join('model', filename)
    console.log(path2file, filename)
    res.download(path2file, filename, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('send work')
        }
    })
}) 