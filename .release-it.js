module.exports = {
  hooks: {
    'after:bump': ['npx auto-changelog -p'],
  },
  git: {
    requireBranch: 'master',
    commit: true,
    commitMessage: 'chore(release): ${version}',
    commitArgs: '',
    tag: true,
    tagName: '${version}',
    tagAnnotation: '${version}',
    push: true,
    requireCommits: true,
    changelog:
      'npx auto-changelog --stdout --commit-limit false -u --template ./release/changelog.hbs'
  },
  github: {
    release: false,
    releaseName: '${version}'
  },
  npm: {
    publish: false
  }
}