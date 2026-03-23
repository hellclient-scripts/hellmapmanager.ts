gcc -O2 -c -fPIC -o hmmlua.o hmmlua-linux.c -I/usr/include/lua5.1/
gcc -shared -o hmmlua.so hmmlua.o -L/path/to/lua/lib 