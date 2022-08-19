module.exports = {
  hooks: {
    'after:bump': 'npx auto-changelog -p',
    'after:git-release': [
      'git add CHANGELOG.md',
      'git push origin master',
      'echo Successfully released ${name} v${version} to ${repo.repository}.'
    ]
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
    changelog: `npx auto-changelog --stdout --commit-limit false -u --template ./templates/changelog.hbs`
  },
  github: {
    release: false,
    releaseName: '${version}'
  },
  npm: {
    publish: false
  }
}
