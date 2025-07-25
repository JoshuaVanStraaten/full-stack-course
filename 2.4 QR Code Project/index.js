/*
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import { input } from '@inquirer/prompts';
import qr from 'qr-image';
import fs from 'node:fs';

const answer = await input({ message: 'Enter a URL: ' });
const qr_svg = qr.image(answer, { type: 'png'});
qr_svg.pipe(fs.createWriteStream('qr_code.png'));

// Save user input to a text file
fs.writeFile("user_input.txt", answer, (err) => {
    if (err) throw err;
});
