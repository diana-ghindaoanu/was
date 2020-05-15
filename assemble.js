#!/usr/bin/env node

'use strict';
var yargs = require ('yargs');
var fs = require ('fs');
var path = require ('path');

yargs.command(['$0 <filename> [options]', 'assemble', 'a'], 'Assemble a file', (yargs) => 
{
	yargs.option('log', {
		alias: 'l',
		default: false,
		desc: 'Print assembly log'
	}).option('debug', {
		alias: 'd',
		default: false,
		desc: 'Include debug information: function and variable names'
	}).option('output', {
		alias: 'o',
		default: null,
		desc: 'Output file name, default is input file name with the .wasm extension'
	});
}, (argv) => {
	var libwabt = require ('wabt')();
	var source = null;
	// console.log (argv.filename);
	try
	{
		source = fs.readFileSync (argv.filename).toString ();
	}
	catch (e)
	{
		console.error (argv.filename+' file not found');
		process.exit (-1);
	}
	let binary = null;
	let binaryout = null;
	try
	{
		if (argv.verbose) console.log ('Parsing '+argv.filename);
		binary = libwabt.parseWat (argv.filename, source);
		if (argv.verbose) console.log ('Resolving names '+argv.filename);
		binary.resolveNames ();
		if (argv.verbose) console.log ('Validating '+argv.filename);
		binary.validate ();
		binaryout = binary.toBinary ({log: argv.log, write_debug_names: argv.debug});
	}
	catch (e)
	{
		console.error (argv.filename+' '+e.message);
		process.exit (-1);
	}
	if (argv.log) console.log (binaryout.log);
	var output = argv.output;
	if (output === null)
	{
		output = path.join (path.dirname(argv.filename), path.basename (argv.filename, '.wat')+'.wasm');
	}
	if (argv.verbose) console.log ('Writing '+output);
	try
	{
		fs.writeFileSync (output, binaryout.buffer);
	}
	catch (e)
	{
		console.error (argv.filename+' '+e.message);
	}
}).command(['disassemble <filename> [options]', 'd'], 'Disassemble a file', (yargs) => {
	yargs.option('output', {
		alias: 'o',
		default: null,
		desc: 'Output file name, default is input file name with the .wat extension'
	}).option('debug', {
		alias: 'd',
		default: false,
		desc: 'Load debug information: function and variable names'
	}).option('names', {
		alias: 'n',
		default: false,
		desc: 'Generate names for functions and variables'
	}).option('inline-export', {
		alias: 'e',
		default: false,
		desc: 'Write inline export'
	}).option('fold', {
		alias: 'f',
		default: false,
		desc: 'Folde expresssion'
	});
}, (argv) => {
	var libwabt = require ('wabt')();
	var binary = null;
	// console.log (argv.filename);
	try
	{
		binary = fs.readFileSync (argv.filename).toString ();
		// console.log (binary);
	}
	catch (e)
	{
		console.error (argv.filename+' file not found');
		process.exit (-1);
	}
	let source = null;
	// let sourceout = null;
	try
	{
		if (argv.verbose) console.log ('Reading '+argv.filename);
		source = libwabt.readWasm(binary, {readDebugNames: argv.debug});
		// console.log (source.toText ({}));
		if (argv.names)
		{
			if (argv.verbose) console.log ('Generating names '+argv.filename);
			source.generateNames ();
			source.applyNames ();
		}
		// if (argv.verbose) console.log ('Validating '+argv.filename);
		// binary.validate ();
		// binaryout = binary.toBinary ({log: argv.log, write_debug_names: argv.debug});
	}
	catch (e)
	{
		console.error (argv.filename+' '+e.message);
		process.exit (-1);
	}
	console.log (source.toBinary({log: true}).log);
	// if (argv.log) console.log (binaryout.log);
	var output = argv.output;
	if (output !== null)
	{
		if (output === true)
		{
			output = path.join (path.dirname(argv.filename), path.basename (argv.filename, '.wasm')+'.wat');
		}
		if (argv.verbose) console.log ('Writing '+output);
		try
		{
			fs.writeFileSync (output, source.toText ({foldeExprs: argv.fold, inlineExport: argv.exports}));
		}
		catch (e)
		{
			console.error (argv.filename+' '+e.message);
		}
	}
}).command(['run <filename> [options]', 'r'], 'Run a file', (yargs) => {
	yargs.option ('import', {
		alias: 'i',
		type: 'array',
		desc: 'Load module (javascript)'
	}).option ('memory', {
		alias: 'm',
		type: 'string',
		desc: 'Set memory, ninPages:maxPages'
	});
}, async (argv) => {
	let memory = null;
	if (argv.memory)
	{
		let mem = argv.memory.split (':');
		if (argv.verbose) console.log ('Alocating memory '+parseInt(mem[0])+'/'+parseInt(mem[1]));
		memory = new WebAssembly.Memory ({initial: parseInt(mem[0]), maximum: parseInt(mem[1])});
	}
	if (argv.verbose) console.log ('Loading imports');
	let importModules = {};
	if (argv.verbose) console.log ('Module io from libraries/io.js');
	importModules.io = require ('./libraries/io.js');
	if (typeof importModules.io.init === 'function') importModules.io.init (memory);
	if (argv.imports)
	{
		for (let moduleFile of argv.imports)
		{
			let moduleName = path.basename (moduleFile, 'js');
			let moduleFullFile = path.resolve (moduleFile);
			try
			{
				importModules[moduleName] = require (path.resolve (moduleFullFile));
				if (typeof importModules[moduleName].init === 'function') importModules[moduleName].init (memory);
				if (argv.verbose) console.log ('Module '+moduleName+' from '+moduleFullFile);
			}
			catch (e)
			{
				console.error ('Module '+moduleName+' '+e.message);
			}
		}
	}
	if (argv.verbose) console.log ('Loading '+argv.filename);
	// console.log (WebAssembly);
	try
	{
		let wasm = fs.readFileSync (argv.filename);
		let wmodule = await WebAssembly.compile (wasm);
		if (!importModules.io) importModules.io = {};
		importModules.io.mem = memory;
		await new WebAssembly.Instance (wmodule, importModules);
	}
	catch (e)
	{
		console.error (argv.filename+' '+e.message);
		process.exit (255);
	}
})
	.option('verbose', {
		alias: 'v',
		default: false,
		desc: 'Print verbose debug'
	})
	.demandCommand ()
	.argv;