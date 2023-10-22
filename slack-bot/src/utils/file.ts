import axios from 'axios';

export const downloadFile = async (fileUrl: string, slackBotToken: string): Promise<Buffer> => {
  try {
    const response = await axios.get(fileUrl, {
      headers: {
        Authorization: `Bearer ${slackBotToken}`,
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error('An error occurred while downloading the file.');
  }
};
