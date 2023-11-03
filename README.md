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

![Check the review results](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/check-review-results.png)

The review results are output in the thread

![review result](https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/review-result.png)

5. If you have further questions, you can use mentions to ask questions.

### Set up

Certainly! Here's the translation in Markdown format:

---

### Setting Up CLI Commands

You can set up CLI commands by either installing from the npm repository or by building locally.

#### Installation from npm

To install from the npm repository, execute the following:

```sh
npm install -g @hiraoku/aireview-cli
```

#### Local Setup

To run locally, execute the following in the root directory:

For building:

```sh
pnpm run cli:build
```

To execute CLI commands:

```sh
pnpm run cli:start
```

With this, you are now able to execute CLI commands.

---

### Creating a .env File

Next, you need to create a .env file. You can set up the .env file by adding the `--init` option to the CLI command.

- If installed via npm:

```sh
aireview --init
```

- If built locally:

```sh
pnpm run cli:start --init
```

In the .env file, you will configure settings for the review request bot, which is set up for Shikoku Metan. The settings are as follows:

![aireview --init](https://storage.googleapis.com/zenn-user-upload/1a5d625c9c15-20231030.png)

- **SLACK_BOT_TOKEN**: Set the `OAuth Tokens for Your Workspace` found in the `OAuth & Permissions` of your Slack App. Set the token that begins with `xoxb-`.

- **SLACK_REVIEWER_BOT_ID**: Set the Member ID of the Workspace where the Slack App is registered.

- **SLACK_CHANNEL_ID**: Set the Channel ID of the registered app.

Set the respective Member ID and Channel ID to `SLACK_REVIEWER_BOT_ID` and `SLACK_CHANNEL_ID` as shown on this screen:

![](https://storage.googleapis.com/zenn-user-upload/23db038705d6-20231030.png)

---

With this, the configuration of CLI commands is complete.

Certainly! Here's the translation in Markdown format:

---

### Setting Up Slackbot

There are two methods to run Slackbot: locally and on Cloud Run.

#### Running Locally

Here's how to set it up locally.

First, configure the `.env` file. In this file, set up the Slack App (zundamon) to send queries to ChatGPT and display the results in Slack. You also set up ChatGPT.

**SLACK_SIGNING_SECRET**  
Retrieve and set the `Signing Secret` from the `Basic Information` page.

**SLACK_BOT_TOKEN**  
From the Slack App's `OAuth & Permissions`, set the `OAuth Tokens for Your Workspace`. Configure the token that starts with `xoxb-`.

**OPENAI_API_KEY**  
Set the API key for OpenAI.

**OPENAI_MODEL**  
Set the model for OpenAI.

Next, install ngrok. Ngrok is a tunneling/reverse proxy tool that allows direct external access to a local server port (localhost) inside a network.

```sh
brew install ngrok/ngrok/ngrok
```

In the root directory of `code-review-things`, run the following to start ngrok:

```sh
pnpm run slack-bot:start
```

Upon launch, a URL in the format `https://xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx.ngrok-free.app` will be displayed under "Forwarding". Set this URL as the `Request URL` on the `Event Subscriptions` page of the Slack App. When setting, add `/slack/events` to the end of the URL.

It should look something like this:  
`https://xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx.ngrok-free.app/slack/events`.

If successful, "Verified ✔" will be displayed.

Next, run the following to start Slackbot:

```sh
pnpm run slack-bot:serve
```

With that, the local setup is complete.

As a side note, although we exposed the local server using ngrok this time, it's also possible to use Slack's [Socket Mode](https://api.slack.com/apis/connections/socket).

#### Running on Cloud Run

First, create a project on the [Google Cloud Console](https://console.cloud.google.com/home/dashboard).

Next, install the `Google Cloud SDK`.

```sh
brew install --cask google-cloud-sdk
```

To deploy, run the following:

```sh
gcloud run deploy code-review-slack-bot \
  --source . \
  --memory 2048Mi \
  --project $PROJECT \
  --allow-unauthenticated
```

Set `$PROJECT` to the project you set up earlier on Google Cloud Console. Once deployment is complete, a URL like  
`https://code-review-slack-bot-XXXXXXXXXXX.a.run.app` will be displayed. Set this URL as the `Request URL` on the `Event Subscriptions` page of the Slack App, just like you did for the local setup.

Next, reopen `Google Cloud Console` and open Cloud Run. You'll see a service named `code-review-slack-bot`. Open `Deploy a new revision`.

Here, open the `Variables and Secrets` tab and set the environment variables. Use the contents of the `.env` file from the local setup as a reference.

![Environment Variable Configuration](https://storage.googleapis.com/zenn-user-upload/b07e8137c9ef-20231031.png)

That completes the setup.

---

## Features

1. Perform code review of code registered for staging in git and output the results to Slack
2. Two Slack-bots are used: a Slack-bot that makes review requests and a Slack-bot that outputs review results, but the characters can be customized.
3. Code review accuracy and prompts can be easily adjusted to customize the code review to suit your needs.

## Reference

## Author

[twitter](https://twitter.com/2020_hira)

## License

[MIT](https://github.com/kotabrog/ft_mini_ls/blob/main/LICENSE)
