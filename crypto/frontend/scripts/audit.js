/**
 * Checks for vulnerable deps.
 *
 * @example
 * node audit
 */

const {exec} = require('child_process');
const fs = require('fs');
const {createHash} = require('crypto');

const filename = './audit.log';
const former = fs.existsSync(filename)
  ? fs.readFileSync(filename, 'utf8')
  : 'none';

exec(`yarn npm audit --all --recursive > ${filename}`, (error) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const date = new Date().toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'long',
      timeZone: 'CET',
    });
    const fingerprint = createHash('md5').update(data).digest('hex');

    fs.writeFile(
      filename,
      `---\nDate: ${date}\nFingerprint: ${fingerprint}\n---\n\n${data}`,
      'utf8',
      (err) => {
        if (err) {
          throw err;
        }

        if (error) {
          if (former.includes(fingerprint)) {
            console.log('No new vulnerabilities detected.\n');
          } else {
            console.log(
              `Some deps are vulnerable.\nFor more information, open the file "${filename}".\n`,
            );
            process.exit(1);
          }
        } else {
          console.log('No vulnerabilities detected.\n');
        }
      },
    );
  });
});
