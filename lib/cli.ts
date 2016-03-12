/// <reference path="../typings/tsd.d.ts" />

import fs = require("fs");
import path = require("path");
import program = require("commander");
import mkdirp = require("mkdirp");
import asyncblock = require("asyncblock");
var glob = require('glob');

import dtsgenerator = require("./index");

var pkg = require("../package.json");


// <hoge> is reuired, [hoge] is optional
program
  .version(pkg.version)
  .usage('[options] <file ... | file patterns using node-glob>')
  .option("-o, --out [file]", "output d.ts filename")
  .parse(process.argv);

interface ICommandOptions {
  args: string[];
  out?: string;
}
var opts: ICommandOptions = <any>program;

if (opts.args.length === 0) {
  readSchemasFromStdin(processGenerate);
} else {
  readSchemasFromFiles(processGenerate);
}

function readSchemasFromStdin(callback: (err: any, schemas: dtsgenerator.model.IJsonSchema[]) => void): void {
  var data = '';
  process.stdin.setEncoding('utf-8');

  process.stdin.on('readable', () => {
    var chunk: string;
    while (chunk = process.stdin.read()) {
      data += chunk;
    }
  });
  process.stdin.on('end', () => {
    var schemas = JSON.parse(data);
    if (!Array.isArray(schemas)) {
      schemas = [schemas];
    }
    callback(null, schemas);
  });
}

function readSchemasFromFiles(callback: (err: any, schemas: dtsgenerator.model.IJsonSchema[]) => void): void {
  asyncblock((flow: asyncblock.IFlow) => {
    flow.errorCallback = (err: any) => {
      callback(err, null);
    };
    opts.args.forEach((arg) => {
      var files = glob.sync(arg);
      files.forEach((file: any) => {
        fs.readFile(file, {encoding: 'utf-8'}, flow.add(file));
      });
    });
    var contents = flow.wait<any>();
    callback(null, Object.keys(contents).map((key) => contents[key]));
  });
}

function processGenerate(err: any, schemas: dtsgenerator.model.IJsonSchema[]): void {
  if (err) {
    throw err;
  }
  var result = dtsgenerator(schemas);
  if (opts.out) {
    mkdirp.sync(path.dirname(opts.out));
    fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
  } else {
    console.log(result);
  }
}

