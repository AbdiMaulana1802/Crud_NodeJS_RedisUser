"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var redis = require('redis');

var client = redis.createClient();
client.on('connect', function () {
  console.log('Connected to Redis');
});
var port = 5000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
})); // Get ALL Data siswa

app.get('/siswa/all', function (req, res) {
  key = 'siswa';
  client.get(key, function _callee(err, obj) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = JSON.parse(obj);
            res.send(data);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}); // Get menggunakan id 

app.get('/siswa/:id', function (req, res) {
  var id = req.params.id;
  client.get('siswa', function (err, obj) {
    // Convert to String
    data = JSON.parse(obj);

    for (var i = 0; i < Object.keys(data).length; i++) {
      if (data[i].id == id) {
        res.send(data[i]);
      } // else{
      //     console.log('User Not Found!')
      // }

    }
  });
}); // tambah data siswa

app.post('/siswa/add', function (req, res) {
  var key = 'siswa';
  var id = req.body.id;
  var nama_siswa = req.body.nama_siswa;
  var umur = req.body.umur;
  var kelas = req.body.kelas;
  var alamat = req.body.alamat;
  var siswas = [];
  client.get(key, function _callee2(err, obj) {
    var data, newDataSiswa, jsonToStr;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(JSON.parse(obj));

          case 2:
            data = _context2.sent;

            // console.log(data)
            if (!data) {// kalau data siswa lama tidak ada jangan jalanin else
            } else {
              // Masukin data lama ke variable siswas
              siswas = data;
            }

            newDataSiswa = {
              'id': id,
              'nama_siswa': nama_siswa,
              'umur': umur,
              'kelas': kelas,
              'alamat': alamat
            }; // Push data baru ke data yang sudah ada

            siswas.push(newDataSiswa); // Convert Json to String

            jsonToStr = JSON.stringify(siswas);
            client.set(key, jsonToStr, function (err, reply) {
              if (err) {
                console.log(err);
              }

              console.log(reply);
              res.send("Data siswa telah di tambahkan");
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
});
app.put('/siswa/:param', function (req, res) {
  var key = 'siswa';
  var param = req.params.param;
  var id = req.body.id;
  var nama_siswa = req.body.nama_siswa;
  var umur = req.body.umur;
  var kelas = req.body.kelas;
  var alamat = req.body.alamat;
  client.get(key, function _callee3(err, obj) {
    var data, i, jsonToStr;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(JSON.parse(obj));

          case 2:
            data = _context3.sent;

            for (i = 0; i < Object.keys(data).length; i++) {
              if (data[i].id == param) {
                // Override data lama dengan data update
                data[i].id = id;
                data[i].nama_siswa = nama_siswa;
                data[i].umur = umur;
                data[i].kelas = kelas;
                data[i].alamat = alamat;
              } else {// console.log(data[i].name)
                // console.log('User Not Found!')
              }
            } // Convert JSON to String


            jsonToStr = JSON.stringify(data);
            client.set(key, jsonToStr, function (err, reply) {
              if (err) {
                console.log(err);
              }

              console.log(reply);
              res.send("Update data siswa berhasil");
            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
}); // delete data siswa

app["delete"]('/siswa/:id', function (req, res) {
  var key = 'siswa';
  var id = req.params.id;
  client.get(key, function _callee4(err, obj) {
    var data, i, jsonToStr;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(JSON.parse(obj));

          case 2:
            data = _context4.sent;

            for (i = 0; i < Object.keys(data).length; i++) {
              if (data[i].id == id) {
                data.splice([i], 1); // console.log(data)
              }
            } // Convert JSON to String


            jsonToStr = JSON.stringify(data);
            client.set(key, jsonToStr, function (err, reply) {
              if (err) {
                console.log(err);
              }

              console.log(reply);
              res.send("Delete data siswa berhasil");
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
});
app.listen(port, function () {
  console.log('memakai localhost ' + port);
});