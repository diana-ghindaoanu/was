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
	writechar: function (v)
	{
		process.stdout.write (String.fromCharCode (v));
	},
	readint: function ()
	{
		let n = 0;
		let nr = true;
		do 
		{
			let v = readByte (fd)-48;
			if (v >= 0 && v <= 9)
			{
				n = n*10+parseInt(v);
			}
			else
			{
				nr = false;
			}
		} while (nr);
		return n;
	},
	readchar: function ()
	{
		return readByte (fd);
	}
};