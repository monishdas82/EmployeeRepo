'use strict';

const express = require('express');
const router = express.Router();
const _ = require('underscore');
const Joi = require('joi');
var externalApi = require('./employeeInfoApi.js');

let DATABASE = [];

const schema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  hireDate: Joi.date().max(Date.now()).required(),
  role: Joi.string().valid(['CEO','VP','MANAGER','LACKEY']).required()
});

/* GET employees listing. */
router.get('/list', function(req, res) {
  return res.send(DATABASE);
});

/* GET employee details. */
router.get('/list/:id', function(req, res) {
  let filteredEmployee = _.where(DATABASE, {"id": req.param("id")});
  return res.send(filteredEmployee);
});

/* ADD to employees listing. */
router.post('/add', async(req, res) => {
  let reqBody = req.body;
  let result = Joi.validate({ firstName: reqBody.firstName, lastName: reqBody.lastName, 
    hireDate: reqBody.hireDate, role: reqBody.role }, schema);
    if(result.error){
      return res.send(result.error);
    }
    const employeeData = await externalApi.populateEmployeeData(reqBody);
    DATABASE.push(employeeData);
  return res.send(DATABASE);
});

/* Delete employees listing. */
router.delete('/delete/:id', function(req, res) {
  let employeeId = req.param("id");
  let employeeIndex = DATABASE.findIndex(obj => obj.id==employeeId);
  DATABASE.splice(employeeIndex, 1);
  return res.send(DATABASE);
});

/* Modifies property of employees listing. */
router.put('/put/:id', function(req, res) {
  let employeeId = req.param("id");
  let reqBody = req.body;
  let result = Joi.validate({ firstName: reqBody.firstName, lastName: reqBody.lastName, 
    hireDate: reqBody.hireDate, role: reqBody.role }, schema);
    if(result.error){
      return res.send(result.error);
    }
  let employeeIndex = DATABASE.findIndex(obj => obj.id==employeeId);  
  DATABASE[employeeIndex].firstName = reqBody.firstName;
  DATABASE[employeeIndex].lastName = reqBody.lastName;
  DATABASE[employeeIndex].hireDate = reqBody.hireDate;
  DATABASE[employeeIndex].role = reqBody.role;
  DATABASE[employeeIndex].firstQuote = reqBody.firstQuote;
  DATABASE[employeeIndex].secondQuote = reqBody.secondQuote;
  return res.send(DATABASE);
});

module.exports = router;
