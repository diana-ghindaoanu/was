;; This is a module that reads and writes a number
(module
	(import "io" "writeint" (func $writeint (param $nr i32)))  ;; import $io.writeint
	(import "io" "readint" (func $readint (result i32)))  ;; import $io.readint

	;; the function
	(func $start
		call $readint  ;; call $readint, the result is placed on the stack
		call $writeint  ;; use the result of write that from the stack as a parameter and call $writeint
	)

	;; set the $start function as the start function
	(start $start)
)