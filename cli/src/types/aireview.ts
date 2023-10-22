export type DiffFiles = Array<DiffFile>;
export type DiffFile = {
  path: string;
  name: string;
  content: string;
};
