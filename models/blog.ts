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

export type PaginatedBlogs = {
  blogs: BlogPost[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type UserRole = "admin" | "end_user";
