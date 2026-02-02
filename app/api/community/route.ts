import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser } from "@/lib/auth"
import { createCommunityPostSchema } from "@/lib/validations"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tag = searchParams.get("tag")
    let query = adminDb
      .collection("communityPosts")
      .where("isApproved", "==", true)
      .where("isHidden", "==", false)

    if (tag) {
      query = query.where("tag", "==", tag) as any
    }

    const postsSnapshot = await query
      .orderBy("createdAt", "desc")
      .limit(50)
      .get()
    const posts = await Promise.all(
      postsSnapshot.docs.map(async (doc) => {
        const data = doc.data()

        // Get reaction count
        const reactionsSnapshot = await adminDb
          .collection("reactions")
          .where("postId", "==", doc.id)
          .get()
        let author = null
        if (!data.isAnonymous && data.authorId) {
          const authorDoc = await adminDb
            .collection("users")
            .doc(data.authorId)
            .get()
          if (authorDoc.exists) {
            const authorData = authorDoc.data()
            author = {
              id: authorDoc.id,
              name: authorData?.name || null,
            }
          }
        }

        return {
          id: doc.id,
          title: data.title || null,
          content: data.content,
          tag: data.tag,
          isAnonymous: data.isAnonymous || false,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
          author,
          reactionsCount: reactionsSnapshot.size,
        }
      })
    )

    return NextResponse.json(posts)
  } catch (error: any) {
    console.error("Error fetching community posts:", error)
    // Return empty array on error instead of 500 to prevent UI breakage
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const validatedData = createCommunityPostSchema.parse(body)

    // Create post - defaults to isApproved = false (requires moderation)
    const postData = {
      ...validatedData,
      authorId: user?.id || null,
      isApproved: false, // Default to requiring moderation
      isHidden: false,
      createdAt: new Date(),
    }

    const docRef = await adminDb.collection("communityPosts").add(postData)
    const doc = await docRef.get()
    const data = doc.data()

    return NextResponse.json(
      {
        id: doc.id,
        title: data?.title || null,
        content: data?.content,
        tag: data?.tag,
        isAnonymous: data?.isAnonymous || false,
        isApproved: data?.isApproved || false,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt || null,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating community post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
