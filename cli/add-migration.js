/**
 * The script automates TypeORM migrations generating process
 * You don't need to input data source path and other parameters yourself
 * Just use `npm run addming -- --name <migration name> --module <module name>` and enjoy
 * © justmavi 2022
 */

const path = require('path');
const fs = require('fs');
const mv = require('mv');
const { spawn } = require('child_process');
const yargs = require('yargs');

const ROOT_FOLDER_NAME = 'src';
const DIST_FOLDER_NAME = 'dist';
const MIGRATIONS_FOLDER_NAME = 'migrations';
const DATA_SOURCE_FILE_NAME = 'data-source.js';
const NPX_COMMAND = /^win/.test(process.platform) ? 'npx.cmd' : 'npx';

const { name, module: moduleName } = yargs(process.argv).argv;

if (!name) {
  exitWithMessage(
    'You must enter migration name. npm run addmig -- --name <name>',
  );
} else if (!moduleName) {
  exitWithMessage(
    'You must enter module name. npm run addmig -- --module <module>',
  );
}

if (!fs.existsSync(path.join(process.cwd(), 'src', moduleName))) {
  exitWithMessage('Migration generation failed. Module does not exists.');
}

const timestamp = Date.now();
const ls = spawn(NPX_COMMAND, [
  'typeorm',
  'migration:generate',
  path.join(ROOT_FOLDER_NAME, moduleName, MIGRATIONS_FOLDER_NAME, name),
  '-d',
  path.join(DIST_FOLDER_NAME, DATA_SOURCE_FILE_NAME),
  '-t',
  timestamp,
]);

ls.stdout.on('data', (data) => {
  const response = data.toString();

  if (response.startsWith('No changes')) {
    exitWithMessage('No changes in database schema were found', 0);
  }

  const filename = `${timestamp}-${name}.ts`;
  const migrationPath = path.join(
    process.cwd(),
    ROOT_FOLDER_NAME,
    moduleName,
    MIGRATIONS_FOLDER_NAME,
    filename,
  );

  const slugifiedName = name
    .replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' + match : match))
    .toLowerCase();

  const newFilename = `${timestamp}-${slugifiedName}.migration.ts`;
  const newMigrationPath = migrationPath.replace(filename, newFilename);

  mv(migrationPath, newMigrationPath, (err) => {
    if (err) {
      exitWithMessage(
        'Error occured while renaming migration file. Maybe, permission denied',
      );
    }
    console.log(
      `Migration ${newMigrationPath} has been generated successfully.`,
    );

    const ls = spawn(NPX_COMMAND, ['prettier', '--write', newMigrationPath]);

    ls.on('close', (code) => {
      if (code !== 0) {
        exitWithMessage(
          'Failed to format migration, but it also created successfully.',
        );
      }

      exitWithMessage('Formatting migration code by prettier is done', code);
    });
  });
});

function exitWithMessage(msg, code = 1) {
  console.log(msg);
  process.exit(code);
}
