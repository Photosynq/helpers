/**
 * Add an Info Message for the User.
 * Use these messages to give additional information (if necessary).
 * @access public
 * @param {string} msg Info Message
 * @param {object} output object that is returned at the end
 * @returns {object} pushes the message into the output object.
 * @example info('Your Info Message', output);
 * // output['messages']['info']['Your Info Message']
 */

function info(msg, output) {
	if (output.messages === undefined)
		output.messages = {};
	if (output.messages.info === undefined)
		output.messages.info = [];
	output.messages.info.push(msg);
}

module.exports.info = info;

/**
 * Add an Warning Message for the User.
 * Use these messages to indicate a potential issue and direct the user to check the measurement again.
 * @access public
 * @param {string} msg Warning Message
 * @param {object} output object that is returned at the end
 * @returns {object} pushes the message into the output object.
 * @example warning('Your Warning Message', output);
 * // output['messages']['warning']['Your Warning Message']
 */

function warning(msg, output) {
	if (output.messages === undefined)
		output.messages = {};
	if (output.messages.warning === undefined)
		output.messages.warning = [];
	output.messages.warning.push(msg);
}

module.exports.warning = warning;

/**
 * Add a Danger Message for the User. These messages will be shown in the data viewer as well.
 * Use these messages to indicate a problematic issue that will most likely result in an invalid measurement.
 * @access public
 * @param {string} msg Danger Message
 * @param {object} output object that is returned at the end
 * @returns {object} pushes the message into the output object.
 * @example danger('Your Danger Message', output);
 * // output['messages']['info']['Your Danger Message']
 */

function danger(msg, output) {
	if (output.messages === undefined)
		output.messages = {};
	if (output.messages.danger === undefined)
		output.messages.danger = [];
	output.messages.danger.push(msg);
}

module.exports.danger = danger;
