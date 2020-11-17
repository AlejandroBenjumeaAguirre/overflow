'use strict'

const question = require('../models/index').questions

async function setAnswerRight (questionId, answerdId, user) {
    let result

    try {
        result = await question.setAnswerRight(questionId, answerdId, user)

    } catch (error) {
        console.error(error)
        return false
    }

    return result
}

async function getLast(amout) {
    let data
    try {
        data = await question.getList(10)
    } catch (error) {
        console.error(error)
    }

    console.log('Se ejecuto el método')

    return data
}

module.exports = {
    setAnswerRight: setAnswerRight,
    getLast: getLast
}