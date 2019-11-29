'use strict';

const axios = require('axios');
const uuidv4 = require('uuid/v4');

async function populateEmployeeData(reqBody){

  let employee = {};
  employee.id = uuidv4();
  employee.firstName = reqBody.firstName;
  employee.lastName = reqBody.lastName;
  employee.hireDate = reqBody.hireDate;
  employee.role = reqBody.role;

  let firstQuotePromise = axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes');
  let secondQuotePromise = axios.get('https://quotes.rest/qod');

  let firstQuote = await firstQuotePromise;
  let secondQuote = await secondQuotePromise;
  employee.firstQuote = firstQuote.data[0];
  employee.secondQuote = secondQuote.data.contents.quotes[0].quote;
  return employee;
}

module.exports = { populateEmployeeData };
