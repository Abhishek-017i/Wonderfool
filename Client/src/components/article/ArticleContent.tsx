interface ArticleContentProps {
  body: string
}

export function ArticleContent({ body }: ArticleContentProps) {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto space-y-6 text-base leading-relaxed text-foreground whitespace-pre-wrap">
      {body}
    </article>
  )
}
