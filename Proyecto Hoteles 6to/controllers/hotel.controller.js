'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveHotel(req, res){
        var hotel = new Hotel();
        let resultado = req.body;

    if(resultado.name && resultado.address && resultado.qualification && resultado.phone && resultado.password && resultado.email){
     
            hotel.name = resultado.name;
            hotel.address = resultado.address;
            hotel.qualification = resultado.qualification;
            hotel.phone = resultado.phone;
            hotel.password = resultado.password;
            hotel.email = resultado.email;
            


            bcrypt.hash(resultado.password, null, null, (err, passwordHash)=>{
                if(err){
                    res.status(500).send({message: 'Error al encriptar contraseña'});
                }else if(passwordHash){
                    hotel.password = passwordHash;

                    hotel.save((err, hotelSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al guardar el HOtel'});
                        }else if(hotelSaved){
                            res.send({message: 'Hotel creado', hotel: hotelSaved});
                        }else{
                            res.status(404).send({message: 'Hotel no guardado'});
                        }
                    });
                }else{
                    res.status(418).send({message: 'Error inesperado'});
                }
            });
      

 
        }
}

function listHotel(req, res){
    Hotel.find({}.exec, (err, listHotel)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        }else if(listHotel){
            res.send({message: 'Lista de Hoteles', listHotel});
        }else{
            res.status(404).send({message: 'Error al enlistar hoteles'});
        }
    }).populate('hotel');
    }



function updateHotel(req, res){
        var idHotel = req.params.id;
        var update  = req.body;
    
        Hotel.findByIdAndUpdate(idHotel, update, {new: true}, (err, HotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(HotelUpdated){
                res.send({message: 'Datos del Hotel actualizado correctamente', HolteEliminado: HotelUpdated});
            }else{
                res.status(404).send({message: 'No se pudo actualizar el hotel'});
            }
        })
    }

function deleteHotel(req, res){
        var eliminar = req.params.id;

        Hotel.findByIdAndRemove(eliminar, (err, HotelDelete)=>{
            if(err){
                res.status(500).send({message: 'Error General', err});

            }else if(HotelDelete){
                res.send({message: 'Eliminar Hotel', HotelDelete});
            }else{
                res.status(404).send({message:'Eliminacion del Hotel exitosa'});
            }
        })
    }


    function login(req, res){
        var params = req.body;
    
        if(params.email){
        if(params.password){
            Hotel.findOne({$or:[{name: params.name}, 
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
                            res.send({message: 'Bienvenido',hotel:check});
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



    
module.exports ={
    saveHotel,
    listHotel,
    updateHotel,
    deleteHotel,
    login,
}

