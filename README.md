# dtsgenerator

[![NPM version](https://badge.fury.io/js/dtsgenerator.svg)](http://badge.fury.io/js/dtsgenerator)
[![Build Status](https://travis-ci.org/horiuchi/dtsgenerator.svg?branch=master)](https://travis-ci.org/horiuchi/dtsgenerator)
[![Coverage Status](https://img.shields.io/coveralls/horiuchi/dtsgenerator.svg)](https://coveralls.io/r/horiuchi/dtsgenerator?branch=coveralls)

TypeScript d.ts file generator from JSON Schema files

## Links about JSON Schema

- [The home of JSON Schema](http://json-schema.org/)
- [JSON Schema wiki for discussions on the next version of the draft](https://github.com/json-schema/json-schema/wiki)

# Install

    npm install -g dtsgenerator

- [Releases](https://github.com/horiuchi/dtsgenerator/releases)

# Usage

```
$ dtsgen --help

  Usage: dtsgen [options] <file ... | file patterns using node-glob>

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -o, --out [file]  output d.ts filename
    -p, --prefix [type prefix]  set the prefix of interface name. default is nothing.

```

## Example

    $ dtsgen --out types.d.ts schema/**/*.schema.json
    $ cat schema1.json | dtsgen
    $ curl 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json' | dtsgen -o swaggerSchema.d.ts

## Debug

Output debug message by [debug](https://www.npmjs.com/package/debug) library.

    $ DEBUG=dtsgen dtsgen schema/news.json


# ChangeLog

## [v0.7.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.7.0) (2016-7-3)

Update with some braking change

## [v0.6.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.6.1) (2016-4-28)

minor update from v0.6.0

## [v0.6.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.6.0) (2016-4-14)

First stable version of `dtsgenerator`
