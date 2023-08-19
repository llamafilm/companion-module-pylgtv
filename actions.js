const { APPS, BUTTONS, INPUTS } = require('./LGconstants')

module.exports = function (self) {
	self.setActionDefinitions({
		sendKey: {
			name: 'Send Key',
			options: [
				{
					id: 'key',
					type: 'dropdown',
					label: 'Key:',
					width: 3,
					required: true,
					choices: BUTTONS
				},
			],
			callback: async (event) => {
				self.log('info', 'Pressing a key!' + JSON.stringify(event.options))
				self.callPython([self.config.host, 'button', event.options.key])
			},
		},
		setInput: {
			name: 'Set Input',
			options: [
				{
					id: 'input',
					type: 'dropdown',
					label: 'Input:',
					width: 3,
					required: true,
					choices: INPUTS
				},
			],
			callback: async (event) => {
				self.log('info', 'Changing input! ' + event.options.input)
				self.callPython([self.config.host, 'set_input', event.options.input])
			},
		},
		launchApp: {
			name: 'Launch App',
			options: [
				{
					id: 'app',
					type: 'dropdown',
					label: 'App:',
					width: 3,
					required: true,
					choices: APPS
				},
			],
			callback: async (event) => {
				self.log('info', 'Launching app! ' + event.options.app)
				self.callPython([self.config.host, 'launch_app', event.options.app])
			},
		},
		screenOff: {
			name: 'Screen Off',
			callback: async (event) => {
				self.log('info', 'Turning off screen!')
				self.callPython([self.config.host, 'turn_screen_off'])
			},
		},
		screenOn: {
			name: 'Screen On',
			callback: async (event) => {
				self.log('info', 'Turning on screen!')
				self.callPython([self.config.host, 'turn_screen_on'])
			},
		},
		screenshot: {
			name: 'Take Screenshot',
			callback: async (event) => {
				self.log('info', 'Taking a screenshot!')
				self.callPython([self.config.host, 'take_screenshot'])
			},
		},
	})
}
