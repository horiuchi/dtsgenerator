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

```sh
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

### Use HTTP/HTTPS Proxy

If you need a proxy to fetch the schema, please set the following environment variables.

```bash
export http_proxy=http://proxy.example.com:8080/
export https_proxy=http://proxy.example.com:8080/
# If there are exceptionally hosts that do not go through a proxy
export no_proxy=google.com, yahoo.com
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

### [v2.7.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.7.0) (2020-06-05)

- features:
  - Support the empty response type on Open API by #416. Thank you @alexkar598 :+1:

### [v2.6.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.6.0) (2020-05-14)

- features:
  - Support nested schema 'allOf' keywords,
    And added support for accessing the remote schema through a proxy by #405. Thank you @Brian-Kavanagh :+1:

### [v2.5.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.5.1) (2020-04-27)

- fixed:
  - Fix: the bug of name conversion by #402. Thank you @unclechu :+1:
  - Fix: Error when spaces included in a 'name' property under paths/parameters by #407. Thank you @scvnathan :+1:

### [v2.5.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.5.0) (2020-02-28)

- features:
  - Add to support the text media type on Open API Schema by #396. Thank you @silesky :+1:

### [v2.4.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.4.1) (2020-02-05)

- fixed
  - Fix: the bug of #386. thank you for reporting issue @Oloompa :+1:

### [v2.4.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v2.4.0) (2020-02-04)

- fixed
  - Fix: typescript import statement #381. thank you @lupus92 :+1:
  - Fix: use `export` when given empty namespace #386. Thank you @zregvart :+1:

### older versions history

[ChangeLogs](https://github.com/horiuchi/dtsgenerator/blob/master/CHANGELOG.md)

## License

`dtsgenerator` is licensed under the MIT license.

Copyright &copy; 2016-2020, [Hiroki Horiuchi](mailto:horiuchi.g@gmail.com)
