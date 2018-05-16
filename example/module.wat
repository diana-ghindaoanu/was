(module
	(import "io" "writestr" (func $writestr (param i32)))
	(import "io" "writeint" (func $writeint (param i32)))
	(import "io" "writechar" (func $writechar (param i32)))
	(import "io" "readstr" (func $readstr (param i32) (param i32) (result i32)))
	(import "io" "readint" (func $readint (result i32)))
	(import "io" "readchar" (func $readchar (result i32)))
	
	(import "io" "mem" (memory 1))

	(data (i32.const 0) "hello\00")

	;; (func $print_str (param $pos i32) (local $v i32)
	;; 	block $end_print
	;; 		loop $start_print
	;; 			get_local $pos
	;; 			i32.load8_u 
	;; 			tee_local $v
	;; 			i32.eqz
	;; 			br_if $end_print
	;; 			get_local $v
	;; 			call $writechar
	;; 			get_local $pos
	;; 			i32.const 1
	;; 			i32.add
	;; 			set_local $pos
	;; 			br $start_print
	;; 		end
	;; 	end
	;; )

	(func $start
		;; call $readint
		;; call $writeint
		;; call $readint
		;; call $writeint
		;; i32.const 0
		;; i32.const 10
		;; call $readstr
		;; call $writeint
		;; i32.const 0
		;; call $print_str
	)
	(start $start)
)