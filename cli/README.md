<div align="center">
  <div>
    <h1 align="center">AI Review Cli</h1>
    <img src="https://raw.githubusercontent.com/s-hiraoku/code-review-things/main/.github/image.png" alt="AI Review Cli"/>
  </div>
  <div>
    <p>An application for code review with AI. This AI Review Cli is responsible for sending files to be reviewed. </p>
    <p>The review results will be output by another application, so it is intended to be used together with that application. See below for details.</p>
    <a href="https://www.npmjs.com/package/@hiraoku/aireview-cli"><img src="https://img.shields.io/npm/v/@hiraoku/aireview-cli" alt="Current version"></a>
  </div>
</div>

## Installation

```sh
npm install -g @hiraoku/aireview-cli
```

※ This section describes how to set up an application that executes commands locally and sends review requests to Slack.  
slack-bot handles the processing on the Slack side. see [Github](https://github.com/s-hiraoku/code-review-things) for details on how to set up slack-bot and the entire review application.  
The review application is a application that allows you to send a review request to Slack.

1. Initialization

   ```sh
   aireview --init
   ```

   Executing the above command will start the .env configuration. You will be asked to enter information in the form of a question, so please set `SLACK_BOT_TOKEN`, `SLACK_BOT_ID`, and `SLACK_CHANNEL_ID`, which are information about the destination Slack.

## Usage

1. Go to the directory where the git managed files reside
2. Modify the code and add the file you want to review to staged
3. Execute the Aireview command; in the terminal, type aireview.
4. If successful, review information will be sent to the configured slack

   ```sh
   aireview
   ```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

- Hiraoku Shinichi - [s.hiraoku@gmail.com]
- Project Link: [https://github.com/s-hiraoku/code-review-things](https://github.com/s-hiraoku/code-review-things)

## Acknowledgments

- Name or link to any articles, libraries, or other resources you found helpful or based your work upon.
