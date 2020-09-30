const { exec, spawn} = require('child_process');
const chalk = require('chalk');

class CLIError extends Error {};

/**
* Custom exec implemention with Promise
* @return Promise
*/
function _exec(cmd, args) {

}

/**
* Custom spawn implementation with Promise
* @return Promise
*/
function _spawn(cmd, args=[]) {
  var message = cmd;
  args.forEach(function(arg) { message += ` ${arg}` });

  console.log(chalk.yellow(`$ ${message}`));

	return new Promise(function(resolve, reject) {

    const child = spawn(cmd, args, {shell: true, stdio: 'inherit'});
    child.on('error', (chunk) => {
      console.log('error: ', chunk);
    });

    child.on('close', (code) => {
      console.log(chalk.yellow(`child process exited with code ${code}`));
      if (code == 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
}

module.exports = {
	CLIError,
	exec: _exec,
	spawn: _spawn
};