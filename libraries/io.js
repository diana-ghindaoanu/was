var fs = require ('fs');
var buffer = Buffer.alloc (1);
var fd; 
if (process.platform === 'win32')
{
	fd = process.stdin.fd;
}
else
{
	fd = fs.openSync('/dev/stdin', 'rs');
}
function readByte (fd)
{
	fs.readSync (fd, buffer, 0, 1);
	return buffer[0];
}

var memory = null;

module.exports = {
	writestr: function (pos)
	{
		if (memory)
		{
			var i8 = new Uint8Array(memory.buffer);
			while (pos < i8.length && i8[pos] !== 0)
			{
				process.stdout.write (String.fromCharCode(i8[pos]));
				pos = pos + 1;
			}
		}
		else
		{
			throw new Error ('There is no memory assigned');
		}
	},
	readstr: function (pos, length)
	{
		if (memory)
		{
			let p = pos;
			var i8 = new Uint8Array(memory.buffer);
			let s = true;
			do 
			{
				let v = readByte (fd);
				// console.log (v);
				if (p < i8.length && p-pos < length-1 && v !== 13 && v !== 10)
				{
					i8[p] = v;
					p = p + 1;
				}
				else
				{
					if (v == 13) readByte (fd);
					s = false;
				}
			} while (s);
			i8[p] = '\0';
			return p-pos;
		}
		else
		{
			throw new Error ('There is no memory assigned');
		}
	},
	init (mem)
	{
		memory = mem;
	},
	writeint: function (n)
	{
		process.stdout.write (''+n);
	},
	writefloat: function (n)
	{
		process.stdout.write (''+n);
	},
	writeuint: function (n)
	{
		process.stdout.write (''+(n | 0));
	},
	writechar: function (v)
	{
		process.stdout.write (String.fromCharCode (v));
	},
	readint: function ()
	{
		let n = 0;
		let nr = true;
		let minus = null;
		do 
		{
			let v = readByte (fd);
			let vc = v-48;
			if (vc >= 0 && vc <= 9)
			{
				n = n*10+parseInt(vc);
				if (minus === null) minus = false;
			}
			if (minus === null && v === '-'.charCodeAt(0))
			{
				minus = true;
			}
			else if (minus === null && (v === 13 || v === 10 || v === 20))
			{
				nr = true;
			}
			else
			{
				nr = false;
			}
		} while (nr);
		if (minus) n = -n;
		return n;
	},
	readfloat: function ()
	{
		let n = 0;
		let dotn = 0.1;
		let nr = true;
		let minus = null;
		let point = false;
		do 
		{
			let v = readByte (fd);
			let vc = v-48;
			if (vc >= 0 && vc <= 9)
			{
				if (!point) n = n*10+parseInt(vc);
				else 
				{
					n = n + dotn*vc;
					dotn = dotn / 10;
				}
				if (minus === null) minus = false;
			}
			if (minus === null && v === '-'.charCodeAt(0))
			{
				minus = true;
			}
			if (point === false && v === '.'.charCodeAt(0))
			{
				point = true;
			}
			else if (minus === null && (v === 13 || v === 10 || v === 20))
			{
				nr = true;
			}
			else
			{
				nr = false;
			}
		} while (nr);
		if (minus) n = -n;
		return n;
	},
	readchar: function ()
	{
		return readByte (fd);
	}
};