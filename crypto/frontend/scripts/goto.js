'use strict';

const fs = require('fs/promises');
const path = require('path');
const yargs = require('yargs');

const {logger, checkCWD} = require('./utils');

/**
 * Fulfills with an array of the entries in the directory excluding `.` and `..`.
 *
 * @param  {string} dir Path string.
 * @returns {Promise<fs.Dirent[]>} Array of directory entries.
 */
const getDirent = (dir) => fs.readdir(dir, {withFileTypes: true});

/**
 * Returns an array with the directory name of the available sources.
 *
 * @param  {...string} dirs Path strings.
 * @returns {string[]} Array of directories for sources.
 */
const getSources = (...dirs) =>
  Promise.all(
    dirs.map((dir) =>
      getDirent(dir).then((items) =>
        items
          .filter((item) => item.isDirectory())
          .map(({name}) => path.join(dir, name)),
      ),
    ),
  ).then((items) => items.flat());

// swappable folders
const swaps = ['client', 'generated', 'pages', 'scenes', 'schema'];

// do not link these resources
const skiplist = ['.DS_Store', 'README.md'];

const run = async () => {
  try {
    checkCWD();

    const sources = await getSources('playground');
    const argv = yargs
      .usage(
        `Usage:
          ㅤgoto PLAYGROUND_SUBFOLDER
          ㅤgoto {--initial | --final | --source=PLAYGROUND_SUBFOLDER}`,
      )
      .command('$0 [source]', false, (yargs) =>
        yargs
          .option('initial', {
            description: 'Initial sandbox',
            type: 'boolean',
            conflicts: ['final', 'source'],
          })
          .option('final', {
            description: 'Final sandbox',
            type: 'boolean',
            conflicts: ['initial', 'source'],
          })
          .option('source', {
            describe: 'Path to content folder',
            type: 'string',
            conflicts: ['initial', 'final'],
          })
          .middleware((argv) => {
            if (argv.initial) {
              argv.source = 'playground/0-initial';
            } else if (argv.final) {
              argv.source = 'playground/X-final';
            }
          })
          .check((argv) => {
            if (argv.source?.trim()) {
              if (sources.includes(path.join(argv.source, '.'))) {
                return true;
              }

              throw new Error('Argument source is invalid');
            }

            throw new Error('Argument source is missing');
          }),
      )
      .strict()
      .example([
        ['goto --initial'],
        ['goto playground/1-hello.1'],
        ['goto playground/mysandbox'],
        ['goto --final'],
      ])
      .version(false)
      .alias('h', 'help')
      .hide('h').argv;

    const source = path.resolve(argv.source);
    const target = process.cwd();

    for (const item of swaps) {
      const from = path.join(source, item);
      const to = path.join(target, item);

      await fs.mkdir(from, {recursive: true});
      await fs.rm(to, {recursive: true, force: true});
    }

    const resources = await getDirent(source);

    for (const item of resources) {
      if (!skiplist.includes(item.name)) {
        const from = path.join(source, item.name);
        const to = path.join(target, item.name);

        await fs.rm(to, {recursive: true, force: true});
        await fs.cp(from, to, {
          recursive: true,
          force: true,
        });
      }
    }

    logger.info('Done.');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

run();
