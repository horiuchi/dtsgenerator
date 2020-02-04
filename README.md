# dtsgenerator

TypeScript d.ts file generator from JSON Schema file or OpenAPI(Swagger) spec file.

[![nodejs version](https://img.shields.io/node/v/dtsgenerator.svg)](#)
[![npm version](https://badge.fury.io/js/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![build status](https://travis-ci.org/horiuchi/dtsgenerator.svg?branch=master)](https://travis-ci.org/horiuchi/dtsgenerator)
[![Coverage Status](https://coveralls.io/repos/github/horiuchi/dtsgenerator/badge.svg?branch=master)](https://coveralls.io/github/horiuchi/dtsgenerator?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/horiuchi/dtsgenerator.svg)](https://greenkeeper.io/)
[![npm download count](https://img.shields.io/npm/dt/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![dtsgenerator Dev Token](https://badge.devtoken.rocks/dtsgenerator)](https://devtoken.rocks/package/dtsgenerator)
[![MIT license](https://img.shields.io/npm/l/dtsgenerator.svg)](#)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Advance Usage](#advance-usage)
- [Development](#development)
- [ChangeLog](#changelog)
- [License](#license)

## Install

    npm install -g dtsgenerator

- [Releases](https://github.com/horiuchi/dtsgenerator/releases)

## Usage

```
$ dtsgen --help
Usage: script [options] <file ... | file patterns using node-glob>

Options:

  -V, --version                output the version number
  --url <url>                  input json schema from the url. (default: )
  --stdin                      read stdin with other files or urls.
  -o, --out <file>             output d.ts filename.
  -n, --namespace <namespace>  use root namespace instead of definitions or components.schema from OpenAPI, or -n "" to suppress namespaces.
  -h, --help                   output usage information

  Examples:

    $ dtsgen --help
    $ dtsgen --out types.d.ts schema/**/*.schema.json
    $ cat schema1.json | dtsgen
    $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
    $ dtsgen -o petstore.d.ts -n PetStore --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
```

## Advance Usage

For customize the output type name.

### Install for library

    npm install -S dtsgenerator

### Usage for library

For example, it want to add the `I` prefix to the interface name.
This is not usual example...

https://github.com/horiuchi/dtsgenerator/blob/master/example/add-prefix/index.ts
```js
import dtsGenerator, { DefaultTypeNameConvertor, SchemaId } from 'dtsgenerator';
import * as fs from 'fs';

const filePath = '../../test/snapshots/json-schema-draft-04/schema/schema.json';

function typeNameConvertor(id: SchemaId): string[] {
    const names = DefaultTypeNameConvertor(id);
    if (names.length > 0) {
        const lastIndex = names.length - 1;
        names[lastIndex] = 'I' + names[lastIndex];
    }
    return names;
}

async function main(): Promise<void> {
    const content = JSON.parse( fs.readFileSync(filePath, 'utf-8') );
    const result = await dtsGenerator({
        contents: [content],
        typeNameConvertor,
    });
    console.log(result);
}
main();
```

## Development

### Debug

Output debug message by [debug](https://www.npmjs.com/package/debug) library.

    $ DEBUG=dtsgen dtsgen schema/news.json


### Links about JSON Schema and Swagger

- [The home of JSON Schema](http://json-schema.org/)
- [The OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)

### Supported spec and features

- JSON Schema
  - Draft-04 and before
  - Draft-07 and before
- OpenAPI
  - OpenAPI Specification version 2.0
  - OpenAPI Specification version 3.0

- [supported features in these spec](https://github.com/horiuchi/dtsgenerator/blob/master/SupportedFeatures.md)

## ChangeLog

### [v2.4.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.4.0) (2020-02-04)

- fixed
  - Fix: TypeScript import statement #381. Thank you @lupus92 :+1:
  - Fix: use `export` when given empty namespace #386. Thank you @zregvart :+1:

### [v2.3.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.3.2) (2019-11-21)

- fixed
  - Fix: the bug of the specific identifier #375. Thank you for reporting the bug @adriengibrat :+1:

### [v2.3.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.3.1) (2019-09-02)

- features:
  - Support the dynamic JSON media type #363. Thank you @buelsenfrucht :+1:
  - Add to support the `number` type enum values #365. Thank you @vincentlin02 :+1:

### [v2.3.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.3.0) (2019-08-23)

- features:
  - Improve the tuple type output by TypeScript v3 syntax, and Support `maxItems` property #339. Thank you @keean :+1:

### [v2.2.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.2.0) (2019-08-06)

- fixed
  - Fix: "_" character at the end of generated type #358. Thank you @KostblLb :+1:

### [v2.1.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.1.0) (2019-07-18)

- features:
  - Add to support objected example #356. Thank you for reporting the issue #348 by @fantapop :+1:
  - Add to support the `application/x-www-form-urlencoded` branch on OpenAPI. #357

### [v2.0.8](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.8) (2019-06-25)

- fixed
  - Fix: OneOf + type "object" produces empty interface #351. Thank you @polomani :+1:

### [v2.0.7](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.7) (2019-05-07)

- fixed
  - Fix: typename when the path is nested #334. Thank you @steelydylan :+1:
  - Fix: Support ref objects for OAS3 requestBodies + responses #343. Thank you @anttiviljami :+1:

### [v2.0.6](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.6) (2019-02-14)

- fixed
  - Fix "Error: The $ref target is not exists" on valid OpenAPI 3 spec #322. Thank you @f1cognite :+1:

### [v2.0.5](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.5) (2019-01-28)

- features
  - Add to support the `nullable` property on OpenAPI by #319. Thank you @sakari :+1:
    https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#data-types

### [v2.0.4](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.4) (2019-01-07)

- fixed
  - Fix missing schema due to yaml references #318. Thank you @sakari :+1:

### [v2.0.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.1) (2018-12-21)

- fixed
  - A property name cannot contain a "/" #315. Thank you @Reggino :+1:
  - update `.npmignore`

### [v2.0.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.0.0) (2018-10-22)

- features
  - Add to support emit the Request/Response object schema of OpenAPI by #304.

### older versions history

[ChangeLogs](https://github.com/horiuchi/dtsgenerator/blob/master/CHANGELOG.md)

## License

`dtsgenerator` is licensed under the MIT license.

Copyright &copy; 2016-2019, [Hiroki Horiuchi](mailto:horiuchi.g@gmail.com)
