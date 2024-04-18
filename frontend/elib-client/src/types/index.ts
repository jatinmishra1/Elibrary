export type Author = {
  name: string;
};

export type Book = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  file: string;
  author: Author;
};
