'use strict'

const { writeFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const Questions = require('../models/index').questions;
const { v1: uuid } = require('uuid')


const write = promisify(writeFile)


async function createQuestion(req, h) {

    if(!req.state.user){
        return h.redirect('/login')
    }
    console.log(req.payload)
    let result, filename
    try {
        let x = Buffer.from(req.payload.image)
        if(Buffer.isBuffer(x)){
            filename = `${uuid()}.png`
            await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
        }
        result = await Questions.create(req.payload, req.state.user, filename);
        req.log('info', `pregunta creada con el id ${result}`)
    } catch (error) {
        req.log('error', `Ocurrio un error: ${error}`)

        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problemas creando la pregunta'
        }).code(500).takeover()
    }

    return h.redirect(`/question/${result}`)
}

async function answersQuestion(req, h) {
    let result
    try {
        result = await Questions.answers(req.payload, req.state.user)
        console.log(`Respuesta creada: ${result}`)
    } catch (error) {
        console.error(error)
    }

    return h.redirect(`/question/${req.payload.id}`)
}

async function setAnswerRight(req, h) {

    if(!req.state.user){
        return h.redirect('/login')
    }
    
    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
        console.log(result)
    } catch (error) {
        console.error(error)
    }

    return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
    createQuestion: createQuestion,
    answersQuestion: answersQuestion,
    setAnswerRight: setAnswerRight
}