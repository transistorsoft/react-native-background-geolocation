const fs = require('fs-extra')
const path = require('path');
const rimraf = require("rimraf");
const chalk = require('chalk');

const {
  exec,
  spawn,
  CLIError
} = require('./lib');

var args = process.argv.slice(2);
const cmd = args.shift();

const PUBLIC_MODULE_NAME = "react-native-background-geolocation";
const PRIVATE_MODULE_NAME = "react-native-background-geolocation-android";

const COMMAND_MIRROR = 'mirror';
const COMMAND_TYPEDOC = 'typedoc';
const COMMAND_CP_DECLARATIONS = "cp-declarations"
const COMMAND_PUBLISH = 'publish';

const IS_PRIVATE_REPO = process.cwd().split('/').pop() === PRIVATE_MODULE_NAME;

const MENU = {};

function registerCommand(name, description, handler) {
  MENU[name] = {
    description: description,
    handler: handler
  };
}

/// ACTION: mirror
///
if (!IS_PRIVATE_REPO) {
  registerCommand(COMMAND_MIRROR, 'Mirror private repo into the public repo', function() {
    mirror();
  });
}

/// ACTION cp-declarations
///
registerCommand(COMMAND_CP_DECLARATIONS, 'Copy the Typescript declarations from another project', function(args) {
  if (args.length < 1) {
    throw new CLIError('A src-path argument is required, eg: cp-declarations /path/to/other');
  }
  return cpDeclarations(args);
});

/// ACTION: typedoc
///
registerCommand(COMMAND_TYPEDOC, 'Generate the typescript docs', function() {
   typedoc();
});

/// ACTION: publish
///
registerCommand(COMMAND_PUBLISH, 'Prepare repo for publishing', function() {
  publish();
});

/// Prepare module for publishing
///
async function publish() {
  if (!IS_PRIVATE_REPO) {
    await mirrorAsync();
  } else {
    await typedoc();
  }
}

/// Copy Typescript declarations from another repo
///
function cpDeclarations(args) {
  const srcPath = args.shift();
  const cmd = './scripts/cp-declarations ' + srcPath;
  return spawn(cmd);
}

/// Generate typedoc docs
///
function typedoc() {
  const cmd = './scripts/generate-docs';
  console.log('cmd: ', cmd);

  return spawn(cmd);
}

/// Mirror PRIVATE -> PUBLIC repo.
///
async function mirror() {
	const SRC_PATH = path.join('..', PRIVATE_MODULE_NAME);
	console.log('- Mirroring ', SRC_PATH);
	var mirroredPaths = [
		'android',
		'ios',
    'src'
	];

	mirroredPaths.forEach(function(dir) {
    var src = path.join(SRC_PATH, dir);
    var dest = path.join('.', dir);
    console.log('- cp -R ', src, dest);
    fs.copySync(src, dest);
	});

  try {
    await cpDeclarations([SRC_PATH]);
    await typedoc();
  } catch (error) {
    throw error;
  }
}


module.exports = {
  actions: MENU
};
