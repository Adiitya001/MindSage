"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"
import { apiGet, apiPost } from "@/lib/api/client"
import { useAuth } from "@/lib/contexts/AuthContext"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { AccountIcon } from "@/components/account-icon"

interface Post {
  id: string
  author: { id: string; name: string | null } | null
  title?: string | null
  content: string
  tag: string
  isAnonymous: boolean
  createdAt: string
  reactionsCount: number
}

const postTags = ["Life", "Growth", "Anxiety", "Philosophy", "Reflection", "Other"]

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function CommunityPageContent() {
  const { user, getIdToken } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostTag, setNewPostTag] = useState("Life")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [reactedPosts, setReactedPosts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const data = await apiGet<Post[]>("/api/community")
        setPosts(data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load posts")
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    setSubmitting(true)
    setError("")

    try {
      // User is guaranteed to exist because ProtectedRoute ensures authentication
      const token = await getIdToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const newPost = await apiPost<Post>(
        "/api/community",
        {
          title: newPostTitle.trim() || null,
          content: newPostContent.trim(),
          tag: newPostTag,
          isAnonymous,
        },
        token,
        true // requireAuth
      )

      setPosts([newPost, ...posts])
      setNewPostTitle("")
      setNewPostContent("")
      setNewPostTag("Life")
      setIsAnonymous(true)
      setIsCreateDialogOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to create post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReaction = async (postId: string) => {
    if (reactedPosts.has(postId)) return

    try {
      // User is guaranteed to exist because ProtectedRoute ensures authentication
      const token = await getIdToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const result = await apiPost<{ reaction: any; reactionsCount: number }>(
        `/api/community/${postId}/react`,
        { type: "resonated" },
        token,
        true // requireAuth
      )

      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, reactionsCount: result.reactionsCount } : post
        )
      )
      setReactedPosts(new Set([...reactedPosts, postId]))
    } catch (err: any) {
      console.error("Error adding reaction:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <header className="p-8 flex justify-between items-center z-20 shrink-0">
        <MindSageLogo size={32} />
        <div className="flex items-center gap-4">
          <AccountIcon />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            A space to share what you&apos;re carrying
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Share your thoughts, reflections, or feelings. Read what others are
            carrying. This is a calm, thoughtful space—not a debate forum.
          </p>
        </motion.div>

        {/* Create Post Button - user is guaranteed to exist via ProtectedRoute */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Share a thought
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground font-light">
            Loading posts...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-destructive font-light">{error}</p>
          </div>
        )}

        {/* Posts Feed */}
        {!loading && !error && (
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                >
                  <Card className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-light text-muted-foreground">
                            {post.isAnonymous || !post.author ? "Anonymous" : post.author.name || "Anonymous"}
                          </span>
                          <span className="text-xs text-muted-foreground/60">•</span>
                          <span className="text-xs font-light text-muted-foreground/60 uppercase tracking-wider">
                            {post.tag}
                          </span>
                          <span className="text-xs text-muted-foreground/60">•</span>
                          <span className="text-xs text-muted-foreground/60">
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      {post.title && (
                        <h3 className="text-lg font-light mb-2">{post.title}</h3>
                      )}

                      <p className="text-base font-light leading-relaxed text-foreground mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                        <button
                          onClick={() => handleReaction(post.id)}
                          disabled={reactedPosts.has(post.id)}
                          className={`flex items-center gap-2 text-sm font-light transition-colors ${
                            reactedPosts.has(post.id)
                              ? "text-primary cursor-default"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              reactedPosts.has(post.id) ? "fill-current" : ""
                            }`}
                          />
                          <span>{post.reactionsCount}</span>
                          <span className="sr-only">
                            {reactedPosts.has(post.id) ? "Liked" : "Like this post"}
                          </span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-light">
            No posts yet. Be the first to share.
          </div>
        )}
      </main>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-light">Share a thought</DialogTitle>
            <DialogDescription className="font-light">
              This is a calm, reflective space. Share what feels right. Posts require approval before being visible.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg font-light">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Title (optional) */}
            <div>
              <label
                htmlFor="post-title"
                className="text-sm font-light text-muted-foreground mb-2 block"
              >
                Title (optional)
              </label>
              <Input
                id="post-title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="A brief title, if you'd like..."
                disabled={submitting}
                className="font-light"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="post-content"
                className="text-sm font-light text-muted-foreground mb-2 block"
              >
                Your thoughts
              </label>
              <textarea
                id="post-content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share what's on your mind..."
                rows={8}
                disabled={submitting}
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-base font-light leading-relaxed placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Tag */}
            <div>
              <label
                htmlFor="post-tag"
                className="text-sm font-light text-muted-foreground mb-2 block"
              >
                Category
              </label>
              <select
                id="post-tag"
                value={newPostTag}
                onChange={(e) => setNewPostTag(e.target.value)}
                disabled={submitting}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {postTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={submitting}
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-light text-muted-foreground cursor-pointer"
              >
                Post anonymously
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || submitting}
              >
                {submitting ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  )
}

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <CommunityPageContent />
    </ProtectedRoute>
  )
}
