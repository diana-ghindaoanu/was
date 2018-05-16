;; This is a module that reads and writes a character
(module
	(import "io" "writechar" (func $writeint (param $char i32)))  ;; import $io.writechar
	(import "io" "readchar" (func $writeint (result i32)))  ;; import $io.readchar

	;; the function
	(func $start
		call $readchar  ;; call $readchar, the result is placed on the stack
		call $writechar  ;; use the result of write that from the stack as a parameter and call $writechar
	)

	;; set the $start function as the start function
	(start $start)
)