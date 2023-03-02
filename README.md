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

### [v3.15.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.15.1) (2022-03-10)

- fixed:
  - Fix handling of stdin option with config file for #534. Thank you @arnestaphorsius :+1:

### [v3.15.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.15.0) (2022-02-06)

- features:
  - Support mobile wallet media types(`application/jwt` and `application/vnd.apple.pkpass`) for #530. Thank you @eostrom :+1:

### [v3.14.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.14.0) (2022-01-27)

- features:
  - Support the nested `allOf` and `oneOf` schema for #513. Thank you for your report @Cry0nicS :+1:

### [v3.13.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.13.2) (2021-10-08)

- features:
  - Fix the type generation malformed objects with number-like keys for #523. Thank you for your report @DamianOsipiuk :+1:

### [v3.13.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.13.1) (2021-09-29)

- features:
  - Change the plug-in interface, the PluginContext::inputSchemas to IterableIterator for #521. Thank you @djrollins :+1:

### [v3.13.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.13.0) (2021-08-31)

- features:
  - Support new `$schema` types for #507.

### [v3.12.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.12.1) (2021-05-19)

- fixed:
  - Fix referenced parameters not resolved error by #471. Thank you @jschirrmacher :+1:

### [v3.12.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.12.0) (2021-05-13)

- features:
  - Support input type `file` by #496. Thank you @Christian24 :+1:
  - Improve the conversion results of parameters property on OpenAPI by #501.

### [v3.11.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.11.0) (2021-05-11)

- features:
  - Support vendor media types (allow periods in application/*+json) by #497. Thank you @glen-84 :+1:
- fixed:
  - Remove to support the `readOnly` property, because of wrong interpretation by #498. Thank you @hallsbyra :+1:

### [v3.10.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.10.0) (2021-04-26)

- features:
  - Support freeform objects w/ index signature instead of `unknown` keyword by #488. Thank you @medfreeman :+1:
  - Support the `content` property in `Parameters` by #472. Thank you for report @npdev453 :+1:

### [v3.9.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.9.2) (2021-04-19)

- fixed:
  - Fix nested `oneOf` & `anyOf` keywords by #486. Thank you @medfreeman :+1:

### [v3.9.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.9.1) (2021-04-16)

- fixed:
  - Update `generate` function to use recommended immutable approach for typescript transforms by #483. Thank you again @medfreeman :+1:

### [v3.9.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.9.0) (2021-04-13)

- features:
  - support for additionalItems property by #481. Thank you again @medfreeman :+1:

### [v3.8.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.8.0) (2021-04-08)

- features:
  - full support for minItems & maxItems properties by #476. Thank you @medfreeman :+1:

### [v3.7.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.7.1) (2021-02-18)

- fixed:
  - add truthy check for value in `mergeSchema` by #474. Thank you @ricokahler :+1:

### [v3.7.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.7.0) (2021-01-05)

- features:
  - Add the `void` type support by #468. Thank you for your propose @henhal by #445 :+1:

### [v3.6.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.6.0) (2020-12-25)

- features:
  - Improve the type result of oneOf/anyOf property by #467. Thank you for your report @crizo23 by #452 :+1:
  - Improve the internal eslint configuration by #466. Thank you @Goldziher :+1:

### [v3.5.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.5.0) (2020-12-21)

- features:
  - Add to export `ts` object for to use the same version TypeScript in all plugins by #465.

### [v3.4.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.4.1) (2020-12-16)

- fixed:
  - Fix using package without esModuleInterop setting on tsconfig by #460. Thank you @wszydlak :+1:
  - Update TypeScript v4 by #462. Thank you @wszydlak :+1:
  - Add to support the null type enum value by #464. Thank you for your report @Goldziher :+1:

### [v3.4.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.4.0) (2020-12-15)

- features:
  - Add support for multipart media type by #455. Thank you @wszydlak :+1:
  - Add support for passing config object with NodeJS API usage by #456. Thank you @wszydlak :+1:

### [v3.3.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.3.1) (2020-10-05)

- fixed:
  - Elements get type "any" instead of the correct one by #448. Thank you for your report @nachtigall-83 :+1:

### [v3.3.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.3.0) (2020-07-29)

- features:
  - Support the `patternProperties` by #436. Thank you @nfroidure :+1:
- fixed:
  - Definition generated improperly when multiple instances of a resource are inherited by #279. Thank you @btg5679 :+1:
  - Apply the `prettier` config on `.eslintrc.json`.

### [v3.2.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.2.0) (2020-07-20)

- features:
  - Add support for application/octet-stream media type by #431. Thank you @MisterChateau :+1:

### [v3.1.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.1.1) (2020-06-23)

- fixed:
  - Cannot load config file of relative path by #428. Thank you @DamianOsipiuk :+1:

### [v3.1.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.1.0) (2020-06-22)

- features:
  - Add support for nullable anyOf in OpenApi v3 by #426. Thank you @joost-kersjes-webpower :+1:

### [v3.0.3](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.0.3) (2020-06-15)

- fixed:
  - Fix the command option example by #422. Thank you @maapteh :+1:
  - Omit load config error on not config option by #425. Thank you @Christian24 :+1:

### [v3.0.2](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.0.2) (2020-06-11)

- fixed:
  - Remove old example by #421. Thank you @maapteh :+1:

### [v3.0.1](https://github.com/horiuchi/dtsgenerator/releases/tag/v3.0.1) (2020-06-09)

- features:
  - Support the plug-in for pre-process and post-process.
  - Change command line options and Support config file.
  - Use the TypeScript AST for intermediate format.

### older versions history

[ChangeLogs](https://github.com/horiuchi/dtsgenerator/blob/master/CHANGELOG.md)

## License

`dtsgenerator` is licensed under the MIT license.

Copyright &copy; 2016-2020, [Hiroki Horiuchi](mailto:horiuchi.g@gmail.com)
