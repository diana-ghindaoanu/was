# was
WebAssembly assembler JavaScript (libwabt.js) wrapper

## Install

To install was, you may use the npm package manager.
````bash
	npm install -g was
````

If you are using Linux or Mac, you might want to add `sudo` to installation.

## Usage

was can assemble, disassemlbe and run webassembly modules.

It also include an `io` library so writing wasm programs is made easier.

### Assemble

````bash
	was program.wat
````

This will generate a file with the name `program.wasm`.

You may use several options:

| Option | Short | Description |
|--------|-------|-------------|
| `--debug` | `-d` | Add debug information to the wasm binary. This will add a section with the function, variables, table and label names |
| `--log` | `-l` | Write a log about the compiled binary file  | 
| `--output` | `-o` | The name of the output file. If it is not specified, the name of the input file will be used and the extension will be changed to _wasm_ | 

### Disassemble

````bash
	was disassemble program.wasm
````

This will generate a file with the name `program.wat`.

You may use several options:

| Option | Short | Description |
|--------|-------|-------------|
| `--debug` | `-d` | Load the debug information (if it exists) from the wasm binary. This will load the section with the function, variables, table and label names |
| `--names` | `-n` | Generate names for the functions, variable, tables and labels. usually this is used if the debug information is not present.  | 
| `--inline-export` | `-e` | Write the _export_ statements inside the exported element. The default option is to write the export as a separate statement | 
| `--fold` | `-f` | Fold expresssion | 
| `--output` | `-o` | The name of the output file. If it is not specified, the name of the input file will be used and the extension will be changed to _wat_ | 

### Run

````bash
	was run program.wasm
````

This will run the `program.wasm` program using Node.

You may use several options:

| Option | Short | Description |
|--------|-------|-------------|
| `--import` | `-i` | Load a Node module and allow the WebAssembly program to import it. The module may be imported by webassembly using the file name (without extension). All the exprted items from the module are made available to the WebAssembly program. You may write several import items in the command line. |
| `--memory` | `-m` | The format is minPages:maxPages. Set up a memory space with a minimum number of _minPages_ and a maximum number of _maxPages_. A memory page is 64 KB of storage | 

## Libraries

These libraries are automatically imported when running a WebAssembly program with wasm.

### io

The _io_ library provides simple input and output functions.

| Function | Import Statement | Descriptions |
|----------|------------|--------------|
| `mem`    | ````(import "io" "mem" (memory _minPage_))```` | The memory (if it was set with the _--memory_ option). _minPage_ is the minimum number of pages specified |
| `readstr` | ````(import "io" "readstr" (func $readstr (param $strAddr i32) (param $length i32) (result i32)))```` | Reads a string from the standard input and writes it into the memory. The reading is stopped when the return key is pressed, maximum _$length_ bytes are written to the memory. A _\0_ character is added to the buffer. _$strAddr_ is the memory location where the string will be written. The function returns the  number of charcters read (without the _\0_) |
| `readchar` | ````(import "io" "readchar" (func $readchar (result i32)))```` | Reads a charcter from the standard input and returns it |
| `readint` | ````(import "io" "readint" (func $readint (result i32)))```` | Reads a signed integer from the standard input and returns it |
| `writestr` | ````(import "io" "writestr" (func $writestr (param $strAddr i32)))```` | Writes a string to the standard output: _$strAddr_ is the address of a null terminated string inside the memory |
| `writechar` | ````(import "io" "writechar" (func $writechar (param $char i32)))```` | Writes a charcter to the standard output: _$char is the character |
| `writeint` | ````(import "io" "writeint" (func $writeint (param $int i32)))```` | Writes a signed integer to the standard output: _$int is the number |