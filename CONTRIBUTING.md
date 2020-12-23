## How to release the package to npm?

- Bump up version in package.json.
- Create a new release tag in Github, for the bumped version. This should trigger builds in GitHub Actions. The binaries will be uploaded to the action's page.
- Manually download the prebuilt binaries from GitHub and publish.

```
npm publish
```
