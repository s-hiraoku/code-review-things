// app messages
export const REVIEW_REQUEST_MESSAGE = 'ずんだもん！コードレビューの依頼よ！';

// prompt
export const OPENAI_RESTORE_CODE_MESSAGE =
  'Diff file contents and original code before changes are as follows.\nPlease restore the code after changes based on this.';

// slack reply messages
export const SLACK_EMPTY_MESSAGE_REPLY = 'おい、おまえ、メッセージをを入力するのだ。';
export const SLACK_START_REVIEW_MESSAGE = (fileName: string): string => `${fileName}のコードレビューを開始するのだ。`;

export const chatGPTRequestMessages: string[] = [
  'このコードにバグはありませんか？あれば教えてください',
  'このコードをリファクタリングしてください',
];
