# dtsgenerator

TypeScript d.ts file generator from JSON Schema file or Swagger spec file.

[![nodejs version](https://img.shields.io/node/v/dtsgenerator.svg)](#)
[![npm version](https://badge.fury.io/js/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![build status](https://travis-ci.org/horiuchi/dtsgenerator.svg?branch=master)](https://travis-ci.org/horiuchi/dtsgenerator)
[![coverage status](https://img.shields.io/coveralls/horiuchi/dtsgenerator.svg)](https://coveralls.io/r/horiuchi/dtsgenerator?branch=coveralls)
[![Greenkeeper badge](https://badges.greenkeeper.io/horiuchi/dtsgenerator.svg)](https://greenkeeper.io/)
[![npm download count](https://img.shields.io/npm/dt/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![MIT license](https://img.shields.io/npm/l/dtsgenerator.svg)](#)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Development](#development)
- [ChangeLog](#changelog)
- [License](#license)

## Install

    npm install -g dtsgenerator

- [Releases](https://github.com/horiuchi/dtsgenerator/releases)

## Usage

```
$ dtsgen --help

  Usage: dtsgen [options] <file ... | file patterns using node-glob>

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    --url <url>                        input json schema from the url.
    --stdin                            read stdin with other files or urls.
    -o, --out <file>                   output d.ts filename.
    -p, --prefix <type prefix>         set the prefix of interface name. default is nothing.
    -h, --header <type header string>  set the string of type header.
    -t, --target [version]             set target TypeScript version. select from `v2` or `v1`. default is `v2`.

  Examples:

    $ dtsgen --help
    $ dtsgen --out types.d.ts schema/**/*.schema.json
    $ cat schema1.json | dtsgen --target v1
    $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
    $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml

```

## Development

### Debug

Output debug message by [debug](https://www.npmjs.com/package/debug) library.

    $ DEBUG=dtsgen dtsgen schema/news.json


### Links about JSON Schema and Swagger

- [The home of JSON Schema](http://json-schema.org/)
- [JSON Schema wiki for discussions on the next version of the draft](https://github.com/json-schema/json-schema/wiki)
- [Swagger Specification](http://swagger.io/specification/)

## ChangeLog

### [v0.9.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.2) (2017-06-19)

- Fix the bug about `allOf` property of #226. Thank you @dawidgarus @philliphoff :+1:

### [v0.9.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.1) (2017-01-27)

- Improve message in error log. Thank you @gasi :+1:

### [v0.9.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.0) (2016-12-15)

- Add yaml format support! Thank you @jdthorpe :+1:

### [v0.8.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.8.2) (2016-11-7)

- Remove gulp scripts

### [v0.8.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.8.1) (2016-10-24)

- Switch from [dtsm](https://www.npmjs.com/package/dtsm) to [@types](https://www.npmjs.com/~types)

### [v0.8.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.8.0) (2016-10-16)

- Add to support null type for TypeScript 2.0
- Add some input parameters

### [v0.7.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.7.2) (2016-9-19)

- Update dependencies library

### [v0.7.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.7.1) (2016-7-5)

- Fix crash bug #67

### [v0.7.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.7.0) (2016-7-3)

- Update with some braking change

### [v0.6.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.6.1) (2016-4-28)

- Minor update from v0.6.0

### [v0.6.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.6.0) (2016-4-14)

- First stable version of `dtsgenerator`


## License

`dtsgenerator` is licensed under the MIT license.

Copyright &copy; 2016, Hiroki Horiuchi
