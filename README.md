# CODE_REVIEW_THINGS

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/image.png)

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/slack-top.png)

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/slack-thread.png)

## Overview

AI code review of changes from git diffs.

## Requirement

- OpenAI API
- Slack account
- Google Cloud (optional)

## Usage

```
git clone https://github.com/s-hiraoku/code-review-things.git

pnpm run slack-bot:start

pnpm run slack-bot:serve

```

## Features

1. Perform code review of code registered for staging in git and output the results to Slack
2. Two Slack-bots are used: a Slack-bot that makes review requests and a Slack-bot that outputs review results, but the characters can be customized.
3. Code review accuracy and prompts can be easily adjusted to customize the code review to suit your needs.

## Reference

## Author

[twitter](https://twitter.com/2020_hira)

## License

[MIT](https://github.com/kotabrog/ft_mini_ls/blob/main/LICENSE)
