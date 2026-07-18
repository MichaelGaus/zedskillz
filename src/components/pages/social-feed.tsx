"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { posts, users, communities } from "@/lib/mock-data";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Image as ImageIcon,
  Video,
  Smile,
  Users as UsersIcon,
  Search,
  TrendingUp,
  Hash,
  Plus,
  MoreHorizontal,
  Send,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function findUser(id: string) {
  return users.find((u) => u.id === id) || users[0];
}

export function SocialFeed() {
  const { currentUser } = useAppStore();
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const handleLike = (postId: string) => {
    const next = new Set(likedPosts);
    if (next.has(postId)) next.delete(postId);
    else next.add(postId);
    setLikedPosts(next);
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    toast.success("Posted to your feed! 🎉");
    setNewPost("");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Community Feed"
        description="Connect, share, and learn with 124,000+ learners"
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* MAIN FEED */}
        <div className="space-y-4">
          {/* Composer */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your learning journey..."
                    rows={3}
                    className="w-full resize-none bg-muted rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      {[
                        { icon: ImageIcon, label: "Photo" },
                        { icon: Video, label: "Video" },
                        { icon: Smile, label: "Feeling" },
                        { icon: Hash, label: "Tag" },
                      ].map((b, i) => {
                        const Icon = b.icon;
                        return (
                          <button
                            key={i}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title={b.label}
                          >
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="text-xs border rounded px-2 py-1 bg-background">
                        <option>🌍 Public</option>
                        <option>👥 Followers</option>
                        <option>🔒 Private</option>
                      </select>
                      <Button size="sm" onClick={handlePost}>
                        <Send className="w-3 h-3 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed tabs */}
          <Tabs defaultValue="for-you">
            <TabsList className="mb-2">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
            </TabsList>

            <TabsContent value="for-you" className="space-y-4">
              {posts.map((post) => {
                const author = findUser(post.authorId);
                const liked = likedPosts.has(post.id);
                return (
                  <Card key={post.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{author.name}</span>
                            {author.verified && (
                              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground">✓</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              @{author.name.toLowerCase().replace(/\s+/g, "")}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleString()} ·
                            <Badge variant="secondary" className="text-[10px] capitalize">{post.type.replace("_", " ")}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>

                      {post.images && post.images.length > 0 && (
                        <div className={cn(
                          "grid gap-1 mb-3",
                          post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                          {post.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className={cn(
                                "rounded-lg w-full object-cover",
                                post.images!.length === 1 ? "max-h-96" : "h-44"
                              )}
                            />
                          ))}
                        </div>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.map((t) => (
                            <span key={t} className="text-xs text-primary hover:underline cursor-pointer">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors",
                              liked && "text-rose-500"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", liked && "fill-rose-500")} />
                            {post.likes + (liked ? 1 : 0)}
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments.length}
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </button>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comments preview */}
                      {post.comments.length > 0 && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                          {post.comments.slice(0, 2).map((c) => {
                            const cAuthor = findUser(c.authorId);
                            return (
                              <div key={c.id} className="flex gap-2">
                                <Avatar className="w-7 h-7 shrink-0">
                                  <AvatarImage src={cAuthor.avatar} />
                                  <AvatarFallback>{cAuthor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted rounded-lg p-2.5">
                                    <div className="text-xs font-medium">{cAuthor.name}</div>
                                    <div className="text-sm">{c.content}</div>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 ml-2 text-xs text-muted-foreground">
                                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                                    <button className="hover:text-foreground">Like</button>
                                    <button className="hover:text-foreground">Reply</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Add comment */}
                          <div className="flex gap-2">
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarImage src={currentUser.avatar} />
                              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <input
                              value={commentInput[post.id] || ""}
                              onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                              placeholder="Write a comment..."
                              className="flex-1 bg-muted rounded-full px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="communities">
              <div className="grid sm:grid-cols-2 gap-4">
                {communities.map((c) => (
                  <Card key={c.id} className="overflow-hidden">
                    <div className="h-24 relative">
                      <img src={c.banner} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                        <Badge>{c.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{c.name}</h3>
                        {c.joined ? (
                          <Button size="sm" variant="outline">Joined</Button>
                        ) : (
                          <Button size="sm">
                            <Plus className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{c.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <UsersIcon className="w-3 h-3" />
                        {c.members.toLocaleString()} members
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <Card><CardContent className="p-8 text-center text-muted-foreground">Follow your favorite instructors and learners to see their posts here.</CardContent></Card>
            </TabsContent>
            <TabsContent value="trending">
              <Card><CardContent className="p-8 text-center text-muted-foreground">Trending posts across the platform appear here.</CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search people, communities..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Trending Topics</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {[
                { tag: "AIinAfrica", posts: "12.4K posts" },
                { tag: "ZambianTech", posts: "8.2K posts" },
                { tag: "PythonBeginners", posts: "5.6K posts" },
                { tag: "WomenInTech", posts: "4.1K posts" },
                { tag: "WebDev2026", posts: "3.8K posts" },
              ].map((t) => (
                <button key={t.tag} className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="text-sm font-medium">#{t.tag}</div>
                  <div className="text-xs text-muted-foreground">{t.posts}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Suggested to Follow</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {users.filter(u => u.role === "instructor").slice(0, 3).map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-1">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{(u.followers / 1000).toFixed(1)}K followers</div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Follow</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Active Communities</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {communities.filter(c => c.joined).map((c) => (
                <button key={c.id} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                  <img src={c.banner} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium line-clamp-1">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.members.toLocaleString()} members</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
