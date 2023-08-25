# ChangeLog

## v3

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

## v2

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
    <https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#data-types>

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

## v1

### [v1.2.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v1.2.0) (2018-09-12)

- features
  - Add `--namespace <namespace>` option to control the emitted namespace. Thank you @DavidBiesack :+1:

### [v1.1.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v1.1.0) (2018-06-01)

- features
  - Add [the supported features document](https://github.com/horiuchi/dtsgenerator/blob/master/SupportedFeatures.md)
  - Support some properties
    - `title`, `const`, `readOnly`

### [v1.0.0](https://github.com/horiuchi/dtsgenerator/releases/tag/v1.0.0) (2018-03-22)

- features
  - Support JSON Schema Draft-07 and OpenAPI v3
  - Add the library interface for customize type name
  - Remove some unusual command line options
  - And rebuild the architecture
- others
  - Remove the node v4 support

### [v0.9.9](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.9) (2018-01-12)

- Bug fix about previous version code by #267. Thank you @bricka :+1:

### [v0.9.8](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.8) (2018-01-09)

- Bug fix about a block comment code in example node by #221. Thank you @GongT :+1:

### [v0.9.7](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.7) (2017-12-12)

- Support the integer enum type by #263. Thank you @heapx :+1:

### [v0.9.6](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.6) (2017-09-28)

- Bug fix about unresoled $refs by #253. Thank you @skuligowski :+1:

### [v0.9.5](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.5) (2017-07-24)

- Bug fix about tuple type support by #244. Thank you @laurelnaiad :+1:

### [v0.9.4](https://github.com/horiuchi/dtsgenerator/releases/tag/v0.9.4) (2017-07-22)

- Support tuple type of #239, #241. Thank you @laurelnaiad :+1:

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
