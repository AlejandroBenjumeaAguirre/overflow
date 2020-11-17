'use strict'

const question = require('../models/index').questions


function register (req, h) {
    if(req.state.user){
        return h.redirect('/')
    }
    
    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    })
}

async function home(req, h) {
    
    const data = await req.server.methods.getLast(10)

    return h.view('index', {
        title: 'home',
        user: req.state.user,
        questions: data
    })
}

function login(req, h) {
    if(req.state.user){
        return h.redirect('/')
    }

    return h.view('login', {
        title: 'Ingresar',
        user: req.state.user
    })
}

async function viewQuestion(req, h) {
    let data
    try {
        data = await question.getOne(req.params.id)
        if(!data){
            return notFound(req, h)
        }
    } catch (error) {
        console.error(error)
    }

    return h.view('question', {
        title: 'Detalle de la pregunta',
        user: req.state.user,
        question: data,
        key: req.params.id
    })
}

function notFound(req, h) {
    return h.view('404', {}, {layout: 'error-layout'}).code(404)
}

function fileNotFound(req, h) {
    const response = req.response
    if(!req.path.startsWith('/api') && response.isBoom && response.output.statusCode === 404){
        return h.view('404', {}, {layout: 'error-layout'}).code(404)
    }

    return h.continue
}

function ask(req, h) {
    if(!req.state.user){
        return h.redirect('/')
    }

    return h.view('ask', {
        title: 'Crear pregunta',
        user: req.state.user
    })
}

module.exports = {
    register,
    home,
    login,
    notFound,
    fileNotFound,
    ask,
    viewQuestion

}