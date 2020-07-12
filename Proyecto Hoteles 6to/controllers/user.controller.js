'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Hotel = require('../models/hotel.model');
var PDF = require('pdfkit');
var fs = require('fs')

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.username &&
        params.email &&
        params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                 res.send({message: 'Ingresar o correo ya existente'});
            }else{
             user.name = params.name;
             user.username = params.username;
             user.email = params.email;
             user.role = 'ADMIN';
             

             bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                if(err){
                     res.status(500).send({message: 'Error al encriptar contraseña'});
                }else if(passwordHash){
                     user.password = passwordHash;
                     user.save((err, userSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error al guardar usuario'});
                       }else if(userSaved){
                            res.send({message: 'Usuario creado exitosamente', user: userSaved});
                       }else{
                            res.status(404).send({message: 'No se pudo guardar el usuario'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error '});
                }
                });
          }
         });
        }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}

function listUsers(req, res){
    User.find({}.exec, (err, listUsuario)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        }else if(listUsuario){
            res.send({message: 'Lista de Usuarios', listUsuario});
        }else{
            res.status(404).send({message: 'Error al enlistar Usuarios'});
        }
    })
    }


function login(req, res){
        var params = req.body;
    
        if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
            {email: params.email}]}, (err, check)=>{
        if(err){
        res.status(500).send({message: 'Error general'});
        }else if(check){
             bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                if(err){
                    res.status(500).send({message: 'Error al comparar'});
                }else if(passworOk){
                if(params.gettoken = true){
                    res.send({token: jwt.createToken(check)});
                        }else{
                            res.send({message: 'Bienvenido',user:check});
                                }
                        }else{
                            res.send({message: 'Contraseña incorrecta'});
                                }
                            });
                        }else{
                            res.send({message: 'Datos de usuario incorrectos'});
                        }
                    });
            }else{
               res.send({message: 'Ingresa tu contraseña'}); 
            }
        }else{
            res.send({message: 'Ingresa tu correo o tu username'});
        }
    }
    



function updateUser(req, res){
        var userId = req.params.id;
        var update = req.body;
    
        if(userId != req.user.sub){
            res.status(403).send({message: 'Error de permisos para esta ruta'});
        }else{
            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general al actualizar usuario'});
                }else if(userUpdated){
                    res.send({user: userUpdated});
                }else{
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
            });
        }
    }


function deleteUser(req, res){
        var userId = req.params.id;
        
    
        if(userId != req.user.sub){
            res.status(403).send({message: 'Error de permisos para esta ruta'});
        }else{
            User.findByIdAndRemove(userId, (err, userDelete)=>{
                if(err){
                    res.status(500).send({message: 'Error general al eliminar usuario', err});
                }else if(userDelete){
                    res.send({user: userDelete});
                }else{
                    res.status(404).send({message: 'No se ha podido eliminar el usuario'});
                }
            });
        }
    }


    

function ordenaz(req, res){

    Hotel.find((err, ordenaraz)=>{
        if(err){
            res.status(500).send({message: 'Error General', err});
        }else if(ordenaraz){
            res.send({message: 'Lista de Hoteles', ordenaraz});
         }else{
            res.status(404).send({message: 'Error en la peticion'});
            }   
        }).sort({name: 1});
    }

function ordenza(req, res){ 
    Hotel.find((err, ordenarza)=>{
        if(err){
           res.status(500).send({message: 'Error General', err});
        }else if(ordenarza){
           res.send({message: 'Lista de Hoteles', ordenarza});
        }else{
          res.status(404).send({message: 'Erro en la peticion'});
                    }   
        }).sort({name: -1});
}


function fech (req, res){
    var inf = req.body;

    Hotel.find({startDate: {"$gte": new Date(inf.pFecha), "$lt": new Date(inf.sFecha)}}, (err, result)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        }else if(result){
            res.send({message: 'Rango de hoteles por fecha', result})
        }else{
            res.status(404).send({message: 'Hoteles no disponibles'});
        }
    });
}

function createPdf (req, res){
    var id = req.params.id
    var pdf = new PDF();
    pdf.pipe(fs.createWriteStream(__dirname + 'example.pdf'));

    Hotel.findById(id, (err, resultado)=>{
        if(err){
            res.status(500).send({message: 'Error al generar PDF'});
        }else if(resultado){ 
            pdf.text(resultado);
            pdf.end();
            res.send({message: 'PDF trabajado correctamente', resultado});
        }else{

        }
    })
}

function calification (req, res){
    var inf = req.body;

    Hotel.find({stars: inf.stars}, (err, find)=>{
        if(err){
            res.status(500).send({message: 'Error  General'});
        }else if(find){
            res.send({message: 'Calificaciones', find});
        }else{
            res.status(404).send({message: 'Calificacion no encontrada'});
        }
    })
}

function findForMoney(req, res){

        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error General', err});
            }else if(hotelList){
                res.send({message: 'Lista de Hoteles', hotelList});
            }else{
                res.status(404).send({message: 'Error en la peticion'});
            }   
        }).sort({price: 1});
    }
    
    function findForMoney2(req, res){
        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error General', err});
            }else if(hotelList){
                res.send({message: 'Lista de Hoteles', hotelList});
            }else{
                res.status(404).send({message: 'Error en la peticion'});
            }   
        }).sort({price: -1});
    }


module.exports ={
    saveUser,
    listUsers,
    login,
    updateUser,
    deleteUser,
    ordenaz,
    ordenza,
    fech,
    createPdf,
    calification,
    findForMoney,
    findForMoney2
}