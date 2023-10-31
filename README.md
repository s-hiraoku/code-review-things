# CODE_REVIEW_THINGS

**Execution of command**

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/image.png)

**Image of code review request in Slack**

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/slack-top.png)

**Review Results Display in Slack**

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/slack-thread.png)

## Overview

AI code review of changes from git diffs.

## Requirement

- OpenAI API
- Slack account
- Google Cloud (optional)

## Configuration

![png](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/code-review-configuration.png)

## Usage

You can obtain review results through the following procedure and flow:

1. Register the file to be reviewed in the staging area

![Staged changes](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/regist-staged.png)

2. Execute the `aireview` command in the local terminal

![aireview](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/aireview.png)

3. The necessary information is sent to Slack

![code review request](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/code-review-request.png)

4. Check the review results

![](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/check-review-results.png)

The review results are output in the thread

![review result](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/review-result.png)

5. If you have further questions, you can use mentions to ask questions.

### Set up

#### Git clone

```
git clone https://github.com/s-hiraoku/code-review-things.git
```

#### Creating a Slack App

Go to the Slack API page and click [Create an App](https://api.slack.com/apps).  
Select an app name and workspace to create your app.

```
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
