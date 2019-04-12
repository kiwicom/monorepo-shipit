Monorepo Shipit takes care of exporting and importing our source-codes from our private GitLab monorepo into any other Git repository. It can export even from our monorepo to another monorepo. We use it open-source some of our packages to our [GitHub](https://github.com/kiwicom). This way we can develop just like we are used to in one monorepo but we can contribute back to the community by making some of our codes open.

# Shipit part

First, we try to extract relevant commits of our package we want to opensource. Each commit is converted into so called "changeset" which is immutable structure representing one commit. One changeset can contain many diffs which describe changes in one individual file. It's very common to modify many files in commit even outside of the public package. Moreover paths in our internal monorepo are very different from the open-sourced version. Therefore, we apply some filters to hide non-relevant or secret files and to adjust paths in the changeset to match open-source expectations. These modified changesets are then pushed applied in the cloned open-source repository and pushed to the GitHub service.

```text
   .-----------------------------------.
   |                                   |
   |          GitLab Monorepo          |
   |                                   |
   `-----------------------------------`
      v              v              v
.-----------.  .-----------.  .-----------.
| Changeset |  | Changeset |  | Changeset |
`-----------`  `-----------`  `-----------`
      v              v              v
   .-----------------------------------.
   |        Filters and Modifiers      |
   `-----------------------------------`
      v              v              v
.-----------.  .-----------.  .-----------.
| Changeset |  | Changeset |  | Changeset |
`-----------`  `-----------`  `-----------`
      |              |              v
      |              |         .---------.
      |              |         | GH repo | <------.
      |              v         `---------`        |      .--------------------.
      |         .---------.                       |      |                    |
      |         | GH repo | <---------------------+----> |   GitHub service   |
      v         `---------`                       |      |                    |
 .---------.                                      |      `--------------------`
 | GH repo | <------------------------------------`
 `---------`
```

One of the filters modifies commit summaries and adds `kiwicom-source-id` signature which helps us to identify which changes we pushed last time and just amend latest internal changes. These filters work with the parsed changesets which gives you incredible flexibility: you can for example completely remove some lines from the open-source version. However, please note that this whole process works with diffs and therefore new filter won't update existing files in GitHub unless you touch them. So, for instance, if you want to remove some files from the public repository then just add a new filter and manually remove them from GitHub.

## Filters

> Please note: this part is still under development and the API is not settled yet.

There are various filters applied on exported changesets to make it work properly. Currently we apply these filters:

- `PathFilters.stripExceptDirectories`
- `PathFilters.moveDirectories`

_TODO: additional filters_

The first filter makes sure that we publish only files relevant to the workspace that is being open-sourced. This filter is automatic. Second `moveDirectories` filter makes sure that we publish correct paths for opensource. It's because out packages are located in for example `src/packages/fetch` but we want to have these files in the root on GitHub (not nested in `src/packages/fetch`). This is the only filter which is being applied while importing the project.

### Filter `PathFilters.moveDirectories`

This filter maps our internal directories to OSS directories and vice versa. Typical minimalistic mapping looks like this:

```js
new Map([
  // from, to
  ['src/packages/fetch/', ''],
]);
```

This maps all the files from our [fetch](https://github.com/kiwicom/fetch) package to the GitHub root so OSS users have access to everything from this package. More advanced example when you need to publish some GitHub specific files:

```js
new Map([
  ['src/packages/fetch/__github__/', ''], // trailing slash is significant
  ['src/packages/fetch/', ''],
]);
```

This mapping moves all the files from `__github__` to the root. There are two things you should understand. Firstly, order matters. First mapping route takes precedence and should be therefore more specific. Secondly, this mapping is irreversible (read more about what does it mean in Importit part).

And finally this is how you'd map your package to the subfolder on GitHub (good for shipping from our monorepo to different monorepo or when you are avoiding previously mentioned irreversibility):

```js
new Map([['src/packages/fetch/', 'packages/fetch/']]);
```

# Importit part

> Please note: this part is not implemented yet! We already import all GitHub pull requests by design but we do not apply them to our repository yet.

Technically, _Importit_ part works just like _Shipit_ except in the opposite direction:

```text
   .-----------------------------------.
   |                                   |
   |          GitLab Monorepo          |
   |                                   |
   `-----------------------------------`
      ^              ^              ^
.-----------.  .-----------.  .-----------.
| Changeset |  | Changeset |  | Changeset |
`-----------`  `-----------`  `-----------`
      ^              ^              ^
   .-----------------------------------.
   |        Filters and Modifiers      |
   `-----------------------------------`
      ^              ^              ^
.-----------.  .-----------.  .-----------.
| Changeset |  | Changeset |  | Changeset |
`-----------`  `-----------`  `-----------`
      ^              ^              ^
      |              |         .---------.
      |              |         | GH repo | <------.
      |              |         `---------`        |      .--------------------.
      |         .---------.                       |      |                    |
      |         | GH repo | <---------------------+----> |   GitHub service   |
      |         `---------`                       |      |                    |
 .---------.                                      |      `--------------------`
 | GH repo | <------------------------------------`
 `---------`
```

## Filters

The only filter being applied when importing the projects is filter which moves directories (see Shipit filters) except it's applied in the reversed order. One important drawback here to understand is that while Shipit filters can have duplicate destinations, Importit filters cannot. This means that not every Shipit filter can be inverted. It's because it would be impossible to figure out how should be the files restored when importing back to our monorepo.

# Main differences from facebook/fbshipit

- our version doesn't support [Mercurial](https://www.mercurial-scm.org/) and it's written in JS (not in Hack)
- our version doesn't support [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- we sync only master branches, other branches are not supported
- we currently cannot do this in one commit:
  - changed Shipit config: https://github.com/facebook/fbshipit/commit/939949dc1369295c910772c6e8eccbbef2a2db7f
  - effect in Relay repo: https://github.com/facebook/relay/commit/13b6436e406398065507efb9df2eae61cdc14dd9

# Prior art

- https://github.com/facebook/fbshipit 👍
- https://git-scm.com/docs/git-filter-branch 😏
- https://github.com/splitsh/lite 👎
