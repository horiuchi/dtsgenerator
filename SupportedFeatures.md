Supported Features
=====

# JSON Schema

- status string
  - o: supported
  - x: no supported
  - p: partially

## Draft-04

|property|status|on TypeScript|
|--------|:----:|----|
|id|o|type name and using referenced target. Restricted URL value only.|
|$schema|o|using to select schema version|
|$ref|p|supported local file and other file reference|
|title|o|comment string|
|description|o|comment string|
|default|x||
|multipleOf|x||
|maximum|x||
|exclusiveMaximum|x||
|minimum|x||
|exclusiveMinimum|x||
|maxLength|x||
|minLength|x||
|pattern|x||
|additionalItems|o||
|items|o|Array type or Tuple type|
|maxItems|o||
|minItems|o||
|uniqueItems|x||
|maxProperties|x||
|minProperties|x||
|required|o|non nullable type|
|additionalProperties|o|if true, add the index signature|
|definitions|o||
|properties|o|add some properties in this type|
|patternProperties|o|merge properties and add index signature|
|dependencies|x|but also search the sub schema types|
|enum|o|enum type, supported string and integer values|
|type|o|The type of that property|
|nullable|o|This property is defined by OpenAPI Specification, not in JSON Schema|
|format|o|comment string|
|allOf|p||
|anyOf|p||
|oneOf|p|same as `anyOf`|
|not|x||

## Draft-07

### deference from Draft-04

|property|status|on TypeScript|
|--------|:----:|----|
|$id|o|replaces `id`|
|$comment|o|comment string|
|readOnly|x||
|writeOnly|x||
|examples|o|comment string|
|contains|x||
|propertyNames|x||
|const|o|literal type|
|contentMediaType|x||
|contentEncoding|x||
|if|x||
|then|x||
|else|x||


# OpenAPI

Basically the same as JSON Schema, but it is supported the additional properties as root object in OpenAPI file.

## Version 2.0

The base JSON Schema version is Draft-04

|additional property|
|:------------------|
|/definitions/*|
|/parameters/*/schema|
|/responses/*/schema|
|/paths/\*/parameters/*/schema|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch)/parameters/*/schema|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch)/responses/*/schema|

## Version 3.0

The base JSON Schema version is Draft-07

|additional property|
|:------------------|
|/components/schemas/*|
|/components/parameters/*/schema|
|/components/requestBodies/*/content/[Media Type]|
|/components/requestBodies/*/$ref|
|/components/responses/*/content/[Media Type]|
|/components/responses/*/$ref|
|/paths/\*/parameters/*/schema|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/parameters/*/content/[Media Type]/schema|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/parameters/*/schema|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/requestBodies/*/content/[Media Type]|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/requestBodies/*/$ref|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/responses/*/content/[Media Type]|
|/paths/\*/(get\|put\|post\|delete\|options\|head\|patch\|trace)/responses/*/$ref|

### Support Media Type

- `application/json`
- `application/x-www-form-urlencoded`
- `application/*+json`
- `application/octet-stream`
- `application/jwt`
- `application/vnd.apple.pkpass`
- `multipart/form-data`
- `text/*`
- `image/*`
