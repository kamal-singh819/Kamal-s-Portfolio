export type BlogFrontmatter = {
  title: string;
  slug: string;
  description: string;
  createdAt: string;
};

export type BlogPost = BlogFrontmatter & {
  id: string;
  content: string;
  contentHtml: string;
  readTime: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  blogId: string;
  name: string;
  comment: string;
  parentId: string | null;
  createdAt: string;
};

export type UserRole = "admin" | "end_user";
