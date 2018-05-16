;; This is a module that writes a number
(module
	(import "io" "writeint" (func $writeint (param $nr i32)))  ;; import $io.writeint

	;; the function
	(func $start
		i32.const 120   ;; set the first function parameter for $writeint
		call $writeint  ;; call $writeint
	)

	;; set the $start function as the start function
	(start $start)
)