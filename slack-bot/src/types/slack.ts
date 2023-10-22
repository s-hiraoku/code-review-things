import { OpenAIRoleType } from './openai';

export type Role = Omit<OpenAIRoleType, 'system'>;
export type SlackMessage = {
  role: Role;
  content: string;
};
export type SlackMessages = Array<SlackMessage>;

export type SlackFile = {
  id: string;
  created: number;
  timestamp: number;
  name: string;
  title: string;
  mimetype: string;
  filetype: string;
  pretty_type: string;
  user: string;
  user_team: string;
  editable: boolean;
  size: number;
  mode: string;
  is_external: boolean;
  external_type: string;
  is_public: boolean;
  public_url_shared: boolean;
  display_as_bot: boolean;
  username: string;
  url_private: string;
  url_private_download: string;
  media_display_type: string;
  permalink: string;
  permalink_public: string;
  is_starred: boolean;
  has_rich_preview: boolean;
  file_access: string;
};

export type SlackFiles = Array<SlackFile>;
