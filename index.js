const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')


let client = redis.createClient()

client.on('connect', function() {
    console.log('Connected to Redis')
})

const port = 5000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Get ALL Data siswa

app.get('/siswa/all', function(req, res) {

    key = 'siswa'

    client.get(key, async function(err, obj) {
        data = JSON.parse(obj)

        res.send(data)

    })

})

// Get menggunakan id 

app.get('/siswa/:id', function(req, res) {

    let { id } = req.params

    client.get('siswa', function(err, obj) {

        // Convert to String
        data = JSON.parse(obj)

        for (var i = 0; i < Object.keys(data).length; i++) {
            if (data[i].id == id) {
                res.send(data[i])
            }
            // else{
            //     console.log('User Not Found!')
            // }
        }



    })

})




// tambah data siswa

app.post('/siswa/add', function(req, res) {

    let key = 'siswa'
    let { id } = req.body
    let { nama_siswa } = req.body
    let { umur } = req.body
    let { kelas } = req.body
    let { alamat } = req.body

    let siswas = []

    client.get(key, async function(err, obj) {

        let data = await JSON.parse(obj)
            // console.log(data)

        if (!data) {
            // kalau data siswa lama tidak ada jangan jalanin else

        } else {
            // Masukin data lama ke variable siswas
            siswas = data

        }

        let newDataSiswa = {
            'id': id,
            'nama_siswa': nama_siswa,
            'umur': umur,
            'kelas': kelas,
            'alamat': alamat,
        }

        // Push data baru ke data yang sudah ada
        siswas.push(newDataSiswa)

        // Convert Json to String
        let jsonToStr = JSON.stringify(siswas)

        client.set(key, jsonToStr, function(err, reply) {
            if (err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Data siswa telah di tambahkan`)
        })

    })


})

app.put('/siswa/:param', function(req, res) {
    let key = 'siswa'
    let { param } = req.params
    let { id } = req.body
    let { nama_siswa } = req.body
    let { umur } = req.body
    let { kelas } = req.body
    let { alamat } = req.body

    client.get(key, async function(err, obj) {
        // Convert String to JSON
        let data = await JSON.parse(obj)

        for (var i = 0; i < Object.keys(data).length; i++) {
            if (data[i].id == param) {

                // Override data lama dengan data update
                data[i].id = id
                data[i].nama_siswa = nama_siswa
                data[i].umur = umur
                data[i].kelas = kelas
                data[i].alamat = alamat

            } else {
                // console.log(data[i].name)
                // console.log('User Not Found!')
            }
        }

        // Convert JSON to String
        let jsonToStr = JSON.stringify(data)

        client.set(key, jsonToStr, function(err, reply) {
            if (err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Update data siswa berhasil`)
        })

    })

})

// delete data siswa

app.delete('/siswa/:id', function(req, res) {
    let key = 'siswa'
    let { id } = req.params

    client.get(key, async function(err, obj) {
        let data = await JSON.parse(obj)

        for (var i = 0; i < Object.keys(data).length; i++) {
            if (data[i].id == id) {
                data.splice([i], 1)
                    // console.log(data)
            }
        }

        // Convert JSON to String
        let jsonToStr = JSON.stringify(data)

        client.set(key, jsonToStr, function(err, reply) {
            if (err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Delete data siswa berhasil`)
        })

    })

})



app.listen(port, function() {
    console.log('memakai localhost ' + port)
})