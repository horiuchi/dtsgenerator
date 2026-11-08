# Dependency modernization

## Scope and responsibilities

Update `horiuchi/dtsgenerator` and the six repositories under the `dtsgenerator`
organization: `eslint-config`, `do-nothing`, `replace-namespace`, `single-quote`,
`decorate-typename`, and `create`, including the latter's generated templates.

Astra specifies the changes, coordinates implementation, reviews the resulting
diffs, and verifies integration. Sol and Luna implement the changes.

## Compatibility requirements

- Support Node.js 22 and 24. The common engine range is
  `^22.22.2 || >=24.15.0`, accommodating the latest package-name validator and
  development tools. CI tests both supported LTS lines.
- Preserve generated declarations byte for byte, including whitespace, comments,
  ordering, quoting, and namespace transformations. Existing snapshots must not
  be regenerated to hide dependency-induced differences.
- Preserve CLI options, stdin/file/URL inputs, help output, exit behavior,
  configuration precedence, and public CommonJS entry points.
- Preserve plugin pre/post-processing contracts and the public `ts` re-export.
- Retain centralized lint rules in `@dtsgenerator/eslint-config`; consumer files
  contain only project-specific configuration and exceptions.
- Preserve existing unrelated working-tree changes.

## Dependency selection

Use current stable versions compatible with the above contracts, updating the
lockfiles as well as manifest ranges. Registry metadata was checked on
2026-09-08. Do not use `--force` or `--legacy-peer-deps` to bypass incompatibility.

TypeScript 7.0.2 is the current latest release, but does not provide the Compiler
API required by this library and its plugins. Use the current JavaScript API
release, `typescript@^6.0.3`, consistently across the ecosystem. The published
`@typescript/typescript6` compatibility wrapper is unnecessary while the regular
6.x package remains available. Keep `@types/node` on the latest 22.x release to
avoid accidentally relying on APIs missing from the lower supported runtime.

Keep the runtime YAML parser on `js-yaml@^4.3.2`, the current compatible 4.x
release. Version 5.4.1 changes the default schema: merge keys stop expanding and
timestamps stop becoming Dates (and therefore ISO strings after the existing
deep-copy step). Its YAML 1.1 schema is not a drop-in replacement either: scalar
syntax, sets, and complex mapping keys differ. Reimplementing the old parser's
semantics would exceed this behavior-preserving update. Regression tests cover
the observed merge and timestamp cases. A 5.x parser used internally by updated
development tools does not change this library's runtime parser selection.

The shared ESLint package migrates to a CommonJS-exported flat-config array.
Consumers spread that array and append their overrides. Parser project discovery
must work from each consumer's tsconfig. Retired rules are replaced by equivalent
rules or explicit compatibility settings; dependency updates must not cause
unrelated semantic refactors. New `lint`/format checks are separated from commands
that intentionally fix files, so verification cannot rewrite source code.

## Implementation sequence

1. Capture the existing build/test results in isolated copies. Distinguish
   installation or external-service failures from update regressions.
2. Modernize and test the shared ESLint package using actual TypeScript fixtures.
3. Update the main package and four plugins, including CI, release workflows,
   Husky invocation, compiler configuration, and necessary compatibility edits.
4. Update `create` and its templates; generate a fresh project and verify the
   generated package, lint, build, tests, and hooks.
5. Test both published dependency contracts and the locally packed updated
   packages together before reflecting reviewed changes into the source repos.

## Acceptance checks

- Clean installation from the intended dependency graph; no invalid peers.
- Build/type checks, lint checks, and existing test/coverage commands on Node.js
  22 and 24, with exact pass/fail/skip counts recorded.
- Existing generated-output snapshots remain unchanged.
- Focused tests for actual dependency migration risks, particularly CLI parsing,
  YAML semantics, file matching, URL handling, and plugin transformations.
- Pack/install smoke tests load the CommonJS API and execute the CLI.
- All four updated plugins run against the updated main package, not merely the
  previously published package accidentally resolved from npm.
- A freshly generated plugin can install, lint, build, and test.
- CI uses the lockfile reproducibly via `npm ci`, with no subsequent unpinned
  global npm update or redundant `npm install`.

## Release boundary

No tags are pushed as part of this change. `eslint-config` targeted 1.0.0
because its configuration interface changes. `do-nothing` originally targeted
3.0.0: its published 2.6.0 package requires exactly
`dtsgenerator@3.19.0`, while the local repository already declares 3.19.2. The
published peer constraint conflicts with the other test plugins and prevents a
clean baseline installation. The corrected contract was published as 3.0.1
rather than overriding an incompatible peer or reusing published metadata.
Other package version fields remain unchanged pending a coordinated release;
dropping old Node.js support must be called out when selecting release versions.

Consumers' normal dependency ranges target the new shared configuration release.
Before that release is published, integration checks must install its locally
packed artifact in a temporary validation environment. Do not commit temporary
absolute paths, localhost registry addresses, or pretend that an unpublished
artifact was downloaded from the public registry. The main package also needs the
new `do-nothing` artifact. The release notes must identify
any installation prerequisite and the exact validation method used.

After publishing each prerequisite package, refresh every consumer lockfile entry
for that exact package from the artifact actually served by the public registry.
Confirm that its version, dependency and peer metadata match the package being
released, and that its `resolved` URL and `integrity` match the downloaded artifact
and published `dist` metadata. Then run `npm ci` from a fresh cache in an isolated
copy. A locally packed artifact
may be used for pre-release integration testing, but its integrity must not be
copied into a registry URL entry, and preloading it into an npm cache does not
count as a public-registry installation check. As of 2026-09-18,
`@dtsgenerator/eslint-config@1.0.0` and `@dtsgenerator/do-nothing@3.0.1` are
published, and the consumer lockfiles have been refreshed from the public
registry artifacts. The main lockfile entry for `do-nothing` records the
published tarball URL and integrity.

The main repository's test-plugin peers also cause npm to install the published
`dtsgenerator@3.19.2` as a development dependency, with its older transitive
dependencies (including TypeScript 5). This is distinct from the updated main
package's runtime graph. Standard repository tests therefore do not alone prove
that plugins use the updated main package or its TypeScript instance. A separate
consumer installs the locally packed updated main and all four updated plugins,
then runs their actual snapshot suites against that single installed main.
Future coordinated version bumps must update these peer/development ranges
together; do not remove this distinction by masking peer conflicts.

## Baseline evidence

The untouched working-tree source was built with the existing installed
dependencies in an isolated directory. Node.js 22.23.2 and 24.20.0 each produced
186 passing tests and one failing test. All 26 declaration-generation snapshots
passed. The failing assertion hard-codes older plugin version strings in the
configuration information output; it must be updated to verify the same format
using the installed package metadata.

Two setup limitations were isolated: the original lockfile cannot be cleanly
installed due to the published `do-nothing` peer conflict described above, and
plugins need the built main package resolvable from their module search path.
Baseline verification used the existing dependencies and an isolated `NODE_PATH`
mapping to the built baseline package. Network access was enabled for the existing
external JSON Schema references. These results do not claim a successful baseline
`npm ci`.

## Verification results

Verified with Node.js 22.23.2 and 24.20.0:

| Package / scenario | Result on each runtime |
| --- | --- |
| Main package | Build, lint, format, 189 tests, coverage report pass; 93.21% line coverage |
| Shared ESLint config | Configuration inspection and real TypeScript fixtures pass |
| `do-nothing` | Build, lint, format, 4 tests and coverage pass |
| `replace-namespace` | Build, lint, format, 3 tests and coverage pass |
| `single-quote` | Build, lint, format, 1 test and coverage pass |
| `decorate-typename` | Build, lint, format, 2 tests and coverage pass |
| `create` CLI | 7 tests pass, including help, argument errors, naming and existing directories |
| Freshly generated plugin | Install, format, lint, build and 4 tests pass; 100% coverage |

All 40 pre-existing expected fixture files across the seven repositories are
byte-identical. All 19 public declaration files emitted by the main package are
also byte-identical to the baseline. Additional comparisons confirmed identical
declarations and AST JSON for object, array and union schemas, and identical YAML
parsing for merge keys, timestamps, scalar values, sets and complex keys.

The generated project's actual Git configuration points `core.hooksPath` to
`.husky/_`. Test-only npm wrappers supply local package artifacts during generated
project integration; the production CLI has no new environment-variable switches
for skipping installation or overriding its dependency specifications.

Before the prerequisite releases, integration was checked using ordinary manifest
ranges and registry URLs in the lockfiles, with the exact unpublished artifacts
first added to an isolated npm cache. `npm ls --all` checked the resulting
dependency graph. This was a pre-release graph check, not a successful
public-registry-only installation. For the main package, npm regenerated the final
lockfile after changing local artifact specs back to normal ranges, ensuring the
published main package required by test-plugin peers and its transitive
dependencies are recorded as well.

These checks did not mean that a fresh public-registry-only install was possible
before the prerequisite packages were published. After each publication, the
consumer lockfiles and fresh-cache `npm ci` result must be verified again against
the public registry. GitHub Actions workflows were updated but had not been
executed on GitHub as part of the original local verification.

Sources: [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/),
[ESLint 10 migration](https://eslint.org/docs/latest/use/migrate-to-10.0.0),
[js-yaml 5 migration](https://github.com/nodeca/js-yaml/blob/master/docs/migrate_v4_to_v5.md),
[Node.js releases](https://nodejs.org/en/about/previous-releases), and the npm
registry metadata for each selected version.
