'use strict';

const fs = require('fs');
const prettier = require('prettier');

const {logger, fetcher, stripBOM, checkCWD, loadEnv} = require('./utils');

const loadConfig = (dir = process.cwd()) => {
  try {
    const {href, protocol} = new URL(
      `${process.env.NEXT_PUBLIC_HTTP_ENDPOINT}?sdl`,
    );

    return {
      url: href,
      filePath: `${dir}/schema/server.graphql`,
      fetcher: fetcher(protocol),
    };
  } catch {
    throw new Error('Endpoint configuration is invalid');
  }
};

const downloadFile = (url, filePath, fetcher) =>
  new Promise((resolve, reject) => {
    fetcher
      .get(url, (res) => {
        const code = res.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(res.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!res.headers.location) {
          return downloadFile(res.headers.location, filePath);
        }

        const fileWriter = fs
          .createWriteStream(filePath, 'utf8')
          .on('error', reject)
          .on('finish', resolve);

        res.pipe(fileWriter);
      })
      .on('error', () => {
        reject(`Unable to download file from:
ㅤ${url}`);
      });
  });

const prettifyFile = async (filePath) => {
  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const options = await prettier.resolveConfig(filePath);

    const formatted = await prettier.format(
      stripBOM(source),
      Object.assign(options, {parser: 'graphql'}),
    );

    fs.rmSync(filePath, {force: true});
    fs.writeFileSync(filePath, formatted, 'utf8');
  } catch {
    throw new Error('Unable to prettify file');
  }
};

const run = async () => {
  try {
    checkCWD();
    loadEnv();

    const {url, filePath, fetcher} = loadConfig();

    await downloadFile(url, filePath, fetcher);
    await prettifyFile(filePath);

    logger.info('Done.');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

run();
