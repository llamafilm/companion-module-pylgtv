const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

const { spawnSync } = require('child_process')
const cmd = '/opt/homebrew/bin/python3'

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'mac',
				label: 'MAC ADDRESS',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'wol_ip',
				label: 'Wake-On-LAN IP',
				width: 6,
				default: '255.255.255.255',
				regex: Regex.IP,
			},

		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	async callPython(args) {
		args.unshift('main.py')
		let result = await spawnSync(cmd, args)
		this.log('debug', 'Python return code: ' + result.status)
		if (result.status == 1) {
			this.log('error', result.stderr.toString())
		}
		else if (result.status == 0) {
			let stdout = result.stdout.toString()
			if (stdout.includes('imageUri')) {
				this.log('info', stdout.match(/imageUri': '(.*)'/)[1])
			}
			else {
				this.log('debug', result.stdout.toString())
			}
		}
		else {
			this.log('error', JSON.stringify(result.stderr.toString()))
		}
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
