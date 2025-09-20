import { PostDetail } from "@/components/post-detail"
import { RelatedPosts } from "@/components/related-posts"

interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-8 max-w-4xl mx-auto space-y-8">
        <PostDetail postId={params.id} />
        <RelatedPosts postId={params.id} />
      </div>
    </div>
  )
}
