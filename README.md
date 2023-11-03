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

### Overview

The following preparations are necessary for the setup:

1. Preparation of the `aireview` command
   We will set up an application to run a CLI command named `aireview` locally.

2. Setup of two Slack Apps
   We will set up the following two Slack Apps:

- A Slack App to receive review requests and notify on Slack.
- A Slack App to receive those requests, inquire with ChatGPT, and display the results on Slack.

3. Setup of Slackbot
   We will set up a Slackbot application to execute the necessary behavior for reviews upon receiving messages from the Slack App.

So, we will proceed with the setup as mentioned. As per the title, we will have Zundamon perform the reviews. Therefore, we will create a Slack App for Zundamon. Also, a Slack App is necessary to send review requests, so we will use Shikoku Metan for this purpose.

The application for executing the review command can be built and run locally, but it is also registered in the npm registry, so you can install and use it from [here](https://www.npmjs.com/package/@hiraoku/aireview-cli).

Slackbot provides two ways to run: building and executing locally, and deploying and running on Cloud Run. You may first want to try it locally, customize and adjust, and once you're familiar with the way it works, consider using Cloud Run.

Since my environment is Mac, I will explain the setup steps for Mac.
If you are using Windows or something else, please adapt the installation steps accordingly to your situation.

### Creating a Slack App

#### Creating a Slack App for Review Requests

This application requires a Slack workspace and channels.
It retrieves review information and displays review results in the workspace channels.
Please make sure these are set up beforehand.

Let’s begin by creating a Slack App for sending review requests.
This is for the "Shikoku Metan" Slack App.

1. Go to the [Slack API page](https://api.slack.com/apps) and click `Create an App`.
2. Select an app name and workspace, then create the app.

Next, move to the `OAuth & Permissions` page to set up Scopes. Configure the necessary permissions under `Scopes`.
The detailed settings are omitted, but please set the necessary permissions as follows. For more details, refer to the [official site](https://api.slack.com/scopes).

![OAuth settings](https://storage.googleapis.com/zenn-user-upload/ec0b160c3ad9-20231030.png)

After completing the settings, install the app to your workspace.
Click `Install to Workspace` to install the application in your workspace. At this point, you will be provided with an `OAuth Access Token`, so make sure to note it down.

Set up `Display Information` as you prefer.

![Display Information](https://storage.googleapis.com/zenn-user-upload/683a5c27e481-20231030.png)

#### Creating a Slack App for Sending Review Requests to ChatGPT

Create a Slack App following the same procedure as before.
This will be for "Zunda Mon".

The settings for Scopes are as follows.
![OAuth settings](https://storage.googleapis.com/zenn-user-upload/6c07286c2ecb-20231030.png)

Set up the `Display Information` as well.

![Display Information](https://storage.googleapis.com/zenn-user-upload/6740d4a8f6ed-20231030.png)

With that, the creation of the Slack App is complete.

Please register the created app in the Slack channel where review exchanges will occur.

### CLI Command Configuration

You can install the CLI command from the npm repository or build it locally.

To install from the npm repository, execute the following command:

```sh
pnpm install -g @hiraoku/aireview-cli
```

To run locally, execute the following in the root directory:

Build:

```sh
pnpm run cli:build
```

Execute CLI command:

```sh
pnpm run cli:start
```

This will make the CLI command executable.

Next, create a .env file.
You can set up the .env file by adding the option --init to the CLI command.

If installed via npm:

```sh
aireview --init
```

If built locally:

```sh
pnpm run cli:start --init
```

The .env file will have settings for the review request bot, which will be for "Shikoku Metan".
The settings are as follows:

![aireview --init](https://storage.googleapis.com/zenn-user-upload/1a5d625c9c15-20231030.png)

**SLACK_BOT_TOKEN**
Set the `OAuth & Permission`'s `OAuth Tokens for Your Workspace` from the "Shikoku Metan" Slack App.
Set the token that starts with `xoxb-`.

**SLACK_REVIEWER_BOT_ID**
Set the member ID from the Workspace where the Slack App is registered. Note that you must set the ID of the reviewer's bot, so please set "Zunda Mon"'s member ID.

![](https://storage.googleapis.com/zenn-user-upload/36f6eadbad8f-20231103.png)

**SLACK_CHANNEL_ID**
Set the **channel ID of the workspace channel** that was created for exchanging review requests. **Be careful not to set the Slack App's channel ID.**

The CLI command configuration is now complete.

### Slackbot Configuration

There are two ways to run the Slackbot: locally or using Cloud Run.

#### Local Startup

First, set up your .env file. This will be the settings for the Slack App (Zunda Mon) that inquires to ChatGPT and displays the results in Slack, as well as the settings for ChatGPT.

**SLACK_SIGNING_SECRET**
From the `Basic Information` page, retrieve and set the `Signing Secret`.

**SLACK_BOT_TOKEN**
Set the `OAuth Tokens for Your Workspace` from the Slack App's `OAuth & Permissions`.
Set the token that starts with `xoxb-`.

**OPENAI_API_KEY**
Set the OpenAI API key.

**OPENAI_MODEL**
Set the OpenAI Model.

Next, install ngrok.
ngrok is a tunneling/reverse proxy tool that allows direct access from the outside to a local server port (localhost) inside the network.

```sh
brew install ngrok/ngrok/ngrok
```

Execute the following in the root directory

to run the server:

```sh
pnpm run dev
```

Next, configure ngrok to use the same port as the Slackbot server.

```sh
ngrok http 3000
```

Set the `Request URL` in the Slack App's `Event Subscriptions` to the URL displayed in the ngrok command.
![Event Subscriptions](https://storage.googleapis.com/zenn-user-upload/9e7e39931645-20231030.png)

#### Launching with Cloud Run

First, create a project at [Google Cloud Console](https://console.cloud.google.com/home/dashboard).

Next, install `Google Cloud SDK`.

```sh
$ brew install --cask google-cloud-sdk
```

To deploy, execute the following command.

```sh
gcloud run deploy code-review-slack-bot \
  --source . \
  --memory 2048Mi \
  --project $PROJECT \
  --allow-unauthenticated
```

Please specify the project you set earlier in the Google Cloud Console for $PROJECT.
After deployment is finished, a URL like `https://code-review-slack-bot-XXXXXXXXXXX.a.run.app` will be displayed. Set this URL in the `Request URL` on the `Event Subscriptions` page of your Slack App, just like you would do for local startup.

There is a chance that the first deployment may fail to start the container due to an error. This could be because the environment variables are not set. In that case, proceed to the next step without making changes.

Then, open `Google Cloud Console` again and go to Cloud Run.
You will see a service created called `code-review-slack-bot`. Open `Deploy new revision`.

Here, click on the `Variables & Secrets` tab and set the environment variables. Use the contents of the .env file from your local setup for reference.

![Setting environment variables](https://storage.googleapis.com/zenn-user-upload/b07e8137c9ef-20231031.png)

That completes the setup.

With these settings, you will be able to perform code reviews.

## Features

1. Perform code review of code registered for staging in git and output the results to Slack
2. Two Slack-bots are used: a Slack-bot that makes review requests and a Slack-bot that outputs review results, but the characters can be customized.
3. Code review accuracy and prompts can be easily adjusted to customize the code review to suit your needs.

## Reference

## Author

[twitter](https://twitter.com/2020_hira)

## License

[MIT](https://github.com/kotabrog/ft_mini_ls/blob/main/LICENSE)
