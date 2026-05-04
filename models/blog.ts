export type BlogFrontmatter = {
  title: string;
  slug: string;
  description: string;
  createdAt: string;
};

export type BlogPost = BlogFrontmatter & {
  content: string;
  readTime: string;
};

export type Comment = {
  id: string;
  blogSlug: string;
  name: string;
  comment: string;
  parentId: string | null;
  createdAt: string;
};
