export type PropLayout = {
  children: React.ReactNode;
}

export type PageParam  = {
  params: { slug: string },
  searchParams: { [key: string]: string | string[] | undefined }
}

export type PageError = {
  error: Error & { digest?: string },
  reset: () => void
}
