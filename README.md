#dtsgenerator

[![NPM version](https://badge.fury.io/js/dtsgenerator.svg)](http://badge.fury.io/js/dtsgenerator)

TypeScript d.ts file generator for JSON Schema file

# Install

    npm install -g dtsgenerator

# Usage

```
$ dtsgen --help

  Usage: dtsgen [options] <file ...>

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -o, --out [file]  output d.ts filename

```

## Example

    dtsgen --out types.d.ts schema1.json schema2.json
