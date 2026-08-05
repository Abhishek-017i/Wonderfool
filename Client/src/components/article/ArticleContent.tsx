import { BodyBlock } from '../../hooks/useArticle'

interface ArticleContentProps {
  body: BodyBlock[]
}

export function ArticleContent({ body }: ArticleContentProps) {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto space-y-6">
      {body.map((block, idx) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-base leading-relaxed text-foreground max-w-[75ch]"
              >
                {block.text}
              </p>
            )

          case 'heading':
            const headingClass =
              block.level === 2
                ? 'text-2xl font-bold'
                : 'text-xl font-semibold'
            return (
              <h2
                key={idx}
                className={`${headingClass} text-foreground pt-4 pb-2`}
              >
                {block.text}
              </h2>
            )

          case 'quote':
            return (
              <blockquote
                key={idx}
                className="pl-4 border-l-4 border-primary italic text-lg text-muted-foreground py-2"
              >
                {block.text}
              </blockquote>
            )

          case 'image':
            return (
              <figure key={idx} className="space-y-2">
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img
                    src={block.url}
                    alt={block.caption || 'Article image'}
                    loading="lazy"
                    className="w-full h-auto"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-sm text-muted-foreground text-center italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'list':
            const ListTag = block.ordered ? 'ol' : 'ul'
            return (
              <ListTag
                key={idx}
                className={`space-y-2 pl-6 ${
                  block.ordered ? 'list-decimal' : 'list-disc'
                } text-foreground`}
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ListTag>
            )

          default:
            return null
        }
      })}
    </article>
  )
}
