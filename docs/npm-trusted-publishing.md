# npm trusted publishing への移行

リリースworkflowは、npmの長期トークンを使う方式からGitHub ActionsのOIDCを使うtrusted publishingへ移行する。GitHub Actions側に`NPM_TOKEN`などの新しいsecretを追加する必要はない。Node.js 24系に同梱されるnpm 11.5.1以降を使用し、`id-token: write`権限でnpmへ短時間だけ有効な認証情報を要求する。

## npmでの設定

各パッケージのnpmページで `Settings` → `Trusted Publisher` を開き、publisherとして `GitHub Actions` を選択する。次の値を登録する。

| npmパッケージ | GitHub owner/repository | Workflow filename | Environment |
| --- | --- | --- | --- |
| `@dtsgenerator/eslint-config` | `dtsgenerator/eslint-config` | `release.yml` | 空欄 |
| `@dtsgenerator/do-nothing` | `dtsgenerator/do-nothing` | `workflow-release.yaml` | 空欄 |
| `@dtsgenerator/replace-namespace` | `dtsgenerator/replace-namespace` | `workflow-release.yaml` | 空欄 |
| `@dtsgenerator/single-quote` | `dtsgenerator/single-quote` | `workflow-release.yaml` | 空欄 |
| `@dtsgenerator/decorate-typename` | `dtsgenerator/decorate-typename` | `workflow-release.yaml` | 空欄 |
| `dtsgenerator` | `horiuchi/dtsgenerator` | `workflow-release.yaml` | 空欄 |
| `@dtsgenerator/create` | `dtsgenerator/create` | なし（手動リリース） | 対象外 |

`create`が生成したプラグインでは、生成先の実際のGitHub owner/repositoryと`workflow-release.yaml`を登録し、Environmentは空欄にする。trusted publisherを登録できるのはnpmレジストリにすでに存在するパッケージだけなので、新規パッケージは最初にnpmへログインし、buildとtestを確認してから`npm publish --ignore-scripts`で一度だけ手動公開する。

npmのtrusted publisher設定にある `Allow direct npm publish` を明示的に有効にする。新規設定ではstage publishが既定のため、この設定が無効なままでは現在のworkflowにある`npm publish`を実行できない。

## 公開順序

1. `@dtsgenerator/eslint-config`
2. `@dtsgenerator/do-nothing`
3. `@dtsgenerator/replace-namespace`、`@dtsgenerator/single-quote`、`@dtsgenerator/decorate-typename`、`dtsgenerator`
4. `@dtsgenerator/create`（必要な場合は手動公開）

`@dtsgenerator/eslint-config@1.0.0`と`@dtsgenerator/do-nothing@3.0.1`は
2026-09-18時点で公開済みであり、両方のconsumer lockfileを公開registryの
artifactから更新済みである。`dtsgenerator`を公開する前提パッケージの公開と
lockfile更新は完了している。

## 公開後のlockfile更新

前提パッケージを公開するたびに、そのパッケージを参照するすべての
`package-lock.json`を公開registryの実体に合わせて更新する。registryの
version、dependencies、peerDependenciesが公開対象と一致することを確認する。
さらに`dist.tarball`を取得して実体のhashを検証し、lockfileの`resolved`と
`integrity`がそのartifactおよび`dist` metadataと一致することを確認する。
その後、作業ツリーとは別のコピーと空のnpm cacheを使って`npm ci`を実行する。

公開前の結合確認にローカルでpackしたartifactを使用しても、そのintegrityを
registry URLのlock entryへ転記しない。ローカルartifactをcacheへ事前投入した
検証は、公開registryだけを使ったinstall確認として扱わない。main lockfileの
`@dtsgenerator/do-nothing` entryは、公開された3.0.1のtarball URLとintegrityに
更新済みである。

## workflowを実行する前の注意

変更したworkflowを含むコミットを先にGitHubへpushする。失敗した古いrunを再実行しても、そのrunが参照していた古いYAMLが使われるためOIDCへの移行確認にはならない。タグで起動するworkflowでは、タグが移行済みコミットを指していることを確認してからpushする。

ローカルで確認できるのはYAMLの構文と設定内容までである。npm UIでtrusted publisherを登録した後、GitHub Actionsから実際に公開し、OIDC認証が成功することを確認する。

参考資料:

- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm trust](https://docs.npmjs.com/cli/v11/commands/npm-trust/)
- [actions/setup-node advanced usage](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md)
