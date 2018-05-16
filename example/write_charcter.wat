;; This is a module that writes a charcter
(module
	(import "io" "writechar" (func $writechar (param $char i32)))  ;; import $io.writechar

	;; the function
	(func $start
		i32.const 70   ;; set the first function parameter for $writechar
		call $writechar  ;; call $writechar
	)

	;; set the $start function as the start function
	(start $start)
)