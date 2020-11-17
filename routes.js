'use strict'

const Joi = require('@hapi/joi');
const cache = require('@hapi/catbox');
const site = require('./controller/site');
const user = require('./controller/user');
const question = require('./controller/question');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: site.home,
        options:{
            cache: {
                expiresIn: 1000 * 30,
                privacy: 'private'
            }
        },
    },
    {
        method: 'GET',
        path: '/register',
        handler: site.register
    },
    {
        path: '/create-user',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required().min(3),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(6)
                }),
                failAction: user.failValidation
            }
        },
        handler: user.createUser
    },
    {
        method: 'GET',
        path: '/login',
        handler: site.login
    },
    {
        method: 'GET',
        path: '/logout',
        handler: user.logout
    },
    {
        method: 'GET',
        path: '/question/{id}',
        handler: site.viewQuestion
    },
    {
        method: 'GET',
        path: '/ask',
        handler: site.ask
    },
    {
        path: '/validate-user',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }),
                failAction: user.failValidation
            }
        },
        handler: user.validateUser
    },
    {
        path: '/create-question',
        method: 'POST',
        options: {
            payload: {
                parse: true,
                multipart: true
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    image: Joi.any().optional()
                }),
                failAction: user.failValidation
            }
        },
        handler: question.createQuestion
    },
    {
        path: '/answer-question',
        method: 'POST',
        options: {
            validate: {
                payload: Joi.object({
                    answer: Joi.string().required(),
                    id: Joi.string().required()
                }),
                failAction: user.failValidation
            }
        },
        handler: question.answersQuestion
    },
    {
        method: 'GET',
        path: '/answer/{questionId}/{answerId}',
        handler: question.setAnswerRight
    },
    {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    },
    {
        method: ['GET', 'POST'],
        path: '/{any*}',
        handler: site.notFound
    }
]
