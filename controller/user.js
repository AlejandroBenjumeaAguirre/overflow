'use strict'

const Boom = require('@hapi/boom');
const users = require('../models/index').users;

async function createUser(req, h) {
    let result
    try {
        result = await users.create({ ...req.payload})
    } catch (error) {
        console.log(error)
        return h.view('register', {
            title: 'Registro',
            error: 'Error creando el usuario'
        })
    }

    return h.view('register', {
        title: 'Registro',
        success: 'Usuario creado exitosamente'
    })
}

async function validateUser(req, h) {
    let result
    try {
        result = await users.validateUser(req.payload)
        if(!result){
            return h.view('login', {
                title: 'Login',
                error: 'Email y/o constraseña incorrecta'
            })
        }
    } catch (error) {
        console.log(error)
        return h.view('login', {
            title: 'Login',
            error: 'Problemas'
        })
    }

    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
    })
}

function logout(req, h){
    return h.redirect('/login').unstate('user')
}

function failValidation (req, h, err) {
    const templates = {
        '/create-user': 'register',
        '/validate-user': 'login',
        '/create-question': 'ask',
        '/answer-question': 'question'
    }

    return h.view(templates[req.path], {
        title: 'Error de validacion', 
        error: 'Por favor complete los campos requeridos'
    }).code(400).takeover()
}

module.exports = {
    createUser: createUser,
    validateUser: validateUser,
    logout: logout,
    failValidation: failValidation
}