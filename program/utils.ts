import * as Boom from 'boom';

const fs = require('fs').promises;

export const checkDate = (date: string) => {
  if (date == undefined || !date.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/))
    throw Boom.badRequest(`Invalid date format, use YYYY-MM-DD.`); 
  return date;
}

export const checkTimestamp = (timestamp: number) => {
  if (timestamp < 1000000000 || timestamp > 2000000000)
    throw Boom.badRequest(`Invalid date timestamp, use an int between 1000000000 and 2000000000.`); 
}

export const errorHandler = (err, res) => {
  if (Boom.isBoom(err)) {
    console.error("BOOM ERROR----------------------");
    console.error(err.output.payload.message + '\n\n' + JSON.stringify(err.data));
    res.status(err.output.statusCode).send(err.output.payload.message + '\n\n' + JSON.stringify(err.data));
  } else {
    console.error("SERVER ERROR--------------------");
    console.error(err);
    res.status(500).send(err);
  }
  console.error("---------------------------------");
}

export const writePictureToFile = (filename: string, pictureData) => {
  const fixedPictureData = pictureData.split(';base64,').pop();
  const buffer = Buffer.from(fixedPictureData, 'base64');
  
  return fs.writeFile(filename, buffer)
  .catch(e => { throw Boom.badData('Failed to save picture.', { data: e }); })
}

export const readPictureFromFile = (filename: string) =>
  fs.readFile(filename /*, 'base64' */)
  //.then(data => `data:image/jpeg;base64, ${data}`)
  .catch(e => { throw Boom.notFound('Failed to get picture.', { data: e }); })