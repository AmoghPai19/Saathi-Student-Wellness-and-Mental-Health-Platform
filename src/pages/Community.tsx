import { useState, useEffect } from "react";
import apiClient from "../api";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

// Icons
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Flag,
  Shield,
  Plus,
  Clock,
  Eye,
  Heart,
  AlertTriangle,
} from "lucide-react";

interface Post {
  _id: string;
  author: { name: string } | string;
  content: string;
  createdAt: string;
  likes: number;
  replies: any[];
  category: string;
  isAnonymous: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  posts: number;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "academic-stress",
      name: "Academic Stress",
      description: "Exam anxiety, study pressure, and academics",
      posts: 0,
    },
    {
      id: "social-anxiety",
      name: "Social Anxiety",
      description: "Making friends, social situations, and relationships",
      posts: 0,
    },
    {
      id: "general-wellness",
      name: "General Wellness",
      description: "Overall mental health, self-care, and daily habits",
      posts: 0,
    },
    {
      id: "peer-support",
      name: "Peer Support",
      description: "Encouragement, motivation, and success sharing",
      posts: 0,
    },
    {
      id: "crisis-support",
      name: "Crisis Support",
      description: "Immediate support needed - monitored 24/7",
      posts: 0,
    },
  ]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/community");
        const fetchedPosts: Post[] = response.data;
        setPosts(fetchedPosts);

        // Count posts per category
        const counts = fetchedPosts.reduce((acc, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            posts: counts[cat.id] || 0,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Submit new post
  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) return;
    try {
      const postData = {
        content: newPostContent,
        authorId: "66e693153549605886291244", // demo user
        isAnonymous: isAnonymous,
        category:
          selectedCategory !== "all" ? selectedCategory : "general-wellness",
      };
      const response = await apiClient.post("/community", postData);
      setPosts([response.data, ...posts]);
      setNewPostContent("");
    } catch (err) {
      alert("Failed to submit post. Please try again.");
    }
  };

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  // Format timestamps
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  // Author details
  const getAuthorDetails = (post: Post) => {
    if (post.isAnonymous) return { name: "Anonymous Student", initial: "A" };
    if (typeof post.author === "object")
      return { name: post.author.name, initial: post.author.name[0] };
    if (typeof post.author === "string")
      return { name: post.author, initial: post.author[0] };
    return { name: "User", initial: "U" };
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-lg scale-200 animate-soft-pulse"></div>
              <Users className="relative h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Peer Support Community
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A safe, moderated space for students to connect, share experiences,
            and support each other
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Discussions
                  <Badge variant="secondary" className="ml-auto flex-shrink-0">
                    {posts.length}
                  </Badge>
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start overflow-hidden whitespace-nowrap"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-medium truncate">{category.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {category.description}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      {category.posts}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="gradient-card border-warning/20 shadow-warm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-warning">
                  <Shield className="h-5 w-5 mr-2" />
                  Community Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Eye className="h-4 w-4 text-success mt-0.5" />
                  <span>All posts are monitored by trained volunteers</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-success mt-0.5" />
                  <span>Anonymous posting available for privacy</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  <span>Crisis posts receive immediate attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Post */}
            <Card className="gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-primary" />
                  Share Your Thoughts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Share your experiences, ask for support, or offer encouragement..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[100px] resize-none"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-border"
                      />
                      <span>Post anonymously</span>
                    </label>

                    <Badge
                      variant={
                        selectedCategory !== "all" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {categories.find((c) => c.id === selectedCategory)?.name ||
                        "General"}
                    </Badge>
                  </div>

                  <Button
                    onClick={handleSubmitPost}
                    disabled={!newPostContent.trim()}
                    className="gradient-primary"
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const author = getAuthorDetails(post);
                return (
                  <Card
                    key={post._id}
                    className="gradient-card border-border shadow-soft hover:shadow-glow transition-gentle"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {author.initial}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{author.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {
                                categories.find(
                                  (c) => c.id === post.category
                                )?.name
                              }
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-foreground leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-success"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.replies.length} replies
                          </Button>
                        </div>

                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
