# dtsgenerator

TypeScript d.ts file generator from JSON Schema file or OpenAPI(Swagger) spec file.

[![nodejs version](https://img.shields.io/node/v/dtsgenerator.svg)](#)
[![npm version](https://badge.fury.io/js/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![Build Status](https://github.com/horiuchi/dtsgenerator/actions/workflows/workflow-ci.yaml/badge.svg)](https://github.com/horiuchi/dtsgenerator/actions/workflows/workflow-ci.yaml)
[![Coverage Status](https://coveralls.io/repos/github/horiuchi/dtsgenerator/badge.svg?branch=master)](https://coveralls.io/github/horiuchi/dtsgenerator?branch=master)
[![npm download count](https://img.shields.io/npm/dt/dtsgenerator.svg)](https://www.npmjs.com/package/dtsgenerator)
[![Stake to support us](https://badge.devprotocol.xyz/0x68c824db5A1634940BB838468Ff2aee2bDa5794B/descriptive)](https://stakes.social/0x68c824db5A1634940BB838468Ff2aee2bDa5794B)
[![MIT license](https://img.shields.io/npm/l/dtsgenerator.svg)](#)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Migration from v2](#migration-from-v2)
- [Plug-in](#plug-in)
- [Development](#development)
- [ChangeLog](#changelog)
- [License](#license)

## Install

    npm install -g dtsgenerator

- [Releases](https://github.com/horiuchi/dtsgenerator/releases)

## Usage

### CLI

```sh
$ dtsgen --help
Usage: dtsgenerator [options] <file ... | file patterns using node-glob>

Options:
  -V, --version           output the version number
  -c, --config <file>     set configuration file path.
  --url <url>             input json schema from the url. (default: [])
  --stdin                 read stdin with other files or urls.
  -o, --out <file>        output filename.
  -t, --target <version>  Specify ECMAScript target version: 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018',
                          'ES2019', 'ES2020', or 'ESNEXT' (default).
  --info                  for developer mode. output loaded config and plugin details only.
  --output-ast            output TypeScript AST instead of d.ts file.
  -h, --help              display help for command

Examples:
  $ dtsgen --help
  $ dtsgen --out types.d.ts schema/**/*.schema.json
  $ cat schema1.json | dtsgen -c dtsgen.json
  $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
  $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
  $ dtsgen -c dtsgen-test.json --info

```

For the configuration file, please refer to the file in the [config_sample](https://github.com/horiuchi/dtsgenerator/tree/master/config_sample/) directory.

### NodeJS API

```js
const { default: dtsgenerator, parseSchema } = require('dtsgenerator');

dtsgenerator({
    contents: [parseSchema({/* JsonSchema object */})],
    config: {/* Config object */},
}).then(content => {
    /* Do someting with parsed content */
}).catch(err => {
    /* Handle errors */
});
```

### Use HTTP/HTTPS Proxy

If you need a proxy to fetch the schema, please set the following environment variables.

```bash
export http_proxy=http://proxy.example.com:8080/
export https_proxy=http://proxy.example.com:8080/
# If there are exceptionally hosts that do not go through a proxy
export no_proxy=google.com, yahoo.com
```

## Migration from v2

The dtsgenerator v3 has made the following breaking changes from v2.

- Support Plug-in feature. See the Plug-in section for more information.
- Change the command line options.
  - Remove the `--namespace` option. Use the `@dtsgenerator/replace-namespace` plug-in instead.
  - Add the `--config` option. Mainly for setting up the Plug-in.
  - And add more options.
- TypeScript AST is now used internally to generate type definitions.

## Plug-in

### How to find plug-in

- Search by npm: <https://www.npmjs.com/search?q=dtsgenerator%20plugin>
- Find by the @dtsgenerator repositories: <https://github.com/dtsgenerator>
  - `@dtsgenerator/replace-namespace` : This plug-in is instead the `--namespace` option on old version.
  - `@dtsgenerator/decorate-typename` : This plug-in can decorate the output type name.
  - `@dtsgenerator/single-quote` : This plug-in replace the quote mark to single.

### How to create plug-in

1. Scaffold by the command:
    - `npm init @dtsgenerator **plugin-name**`
1. Edit `**plugin-name**/index.ts`
1. Do test:
    - `npm test`
1. Build it:
    - `npm run build`
1. Publish to npm:
    - `npm publish`

## Development

### Debug

Output debug message by [debug](https://www.npmjs.com/package/debug) library.

    DEBUG=dtsgen dtsgen schema/news.json

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

### [v3.19.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.19.1) (2023-08-25)

- features:
  - Update plugins for new TypeScript AST.
  - Changed supported Node.js version to 16 or later. Also, we have confirmed that it works with Node.js v20.

### [v3.18.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.18.0) (2023-03-02)

- features:
  - Support 'application/json' with parameter media type for #551. Thank you @denizkenan :+1:

### [v3.17.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.17.0) (2023-02-21)

- features:
  - Return exit code 1 when error occurs by #549. Thank you @lhotamir :+1:

### [v3.16.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.16.2) (2022-12-20)

- fixed:
  - Fix to remove deprecated decorators parameters for #547. Thank you @mcollina :+1:

### [v3.16.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.16.0) (2022-06-10)

- features:
  - Support 'image/*' media types for #539. Thank you @Geloosa :+1:

### older versions history

[ChangeLogs](https://github.com/horiuchi/dtsgenerator/blob/master/CHANGELOG.md)

## License

`dtsgenerator` is licensed under the MIT license.

Copyright &copy; 2016-2020, [Hiroki Horiuchi](mailto:horiuchi.g@gmail.com)
