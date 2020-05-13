(module 
    (import "io" "writestr" (func $writestr (param $strAddr i32)))
    (import "io" "mem" (memory 1))

    (func $start
        i32.const 124
        call $writestr
    )

    (start $start)

    (data $s (i32.const 124) "asm\00")
)