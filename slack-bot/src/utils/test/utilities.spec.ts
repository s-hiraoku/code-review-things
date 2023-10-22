import { sanitizeText, SLACK_MENTION_REGEXP, NEWLINE_REGEXP, EMPTY_STRING } from '../utilities';
describe('sanitizeText', () => {
  it('should remove Slack mentions from the text', () => {
    const input = 'Hello <@USERID1> and <@USERID2>';
    const expected = 'Hello  and ';
    expect(sanitizeText(input)).toBe(expected);
  });

  it('should remove newlines from the text', () => {
    const input = 'Hello\nWorld';
    const expected = 'HelloWorld';
    expect(sanitizeText(input)).toBe(expected);
  });

  it('should remove both Slack mentions and newlines', () => {
    const input = '<@USERID1>\nHello\n<@USERID2>\nWorld';
    const expected = 'HelloWorld';
    expect(sanitizeText(input)).toBe(expected);
  });

  it('should return the same text if no Slack mentions or newlines are present', () => {
    const input = 'Hello World';
    expect(sanitizeText(input)).toBe(input);
  });

  it('should handle empty strings', () => {
    expect(sanitizeText('')).toBe('');
  });
});

describe('Regex Constants', () => {
  it('SLACK_MENTION_REGEXP should match Slack mentions', () => {
    const mention = '<@USERID>';
    expect(SLACK_MENTION_REGEXP.test(mention)).toBe(true);
  });

  it('NEWLINE_REGEXP should match newlines', () => {
    expect(NEWLINE_REGEXP.test('\n')).toBe(true);
  });

  it('EMPTY_STRING should be an empty string', () => {
    expect(EMPTY_STRING).toBe('');
  });
});
