import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MessageSquare,
    Calendar,
    BookOpen,
    Users,
    BarChart3,
    Heart,
    Shield,
    Globe,
    ArrowRight,
    CheckCircle,
    Star,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-wellness.png";
import goluImage from "@/assets/golu.gif";

const Index = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in");
                        entry.target.classList.remove("opacity-0", "translate-y-8");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        document.querySelectorAll(".scroll-animate").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: MessageSquare,
            title: "AI-Guided First-Aid Support",
            description:
                "Get immediate, personalized mental health support with AI-powered coping strategies and crisis intervention.",
            path: "/chat",
            gradient: "gradient-primary",
            badge: "24/7 Available",
        },
        {
            icon: Calendar,
            title: "Confidential Counselor Booking",
            description:
                "Book secure appointments with qualified mental health professionals. Browse profiles, ratings, and availability.",
            path: "/booking",
            gradient: "gradient-accent",
            badge: "Professional Support",
        },
        {
            icon: BookOpen,
            title: "Psychoeducational Resources",
            description:
                "Access wellness guides, meditation sessions, and educational content in multiple regional languages.",
            path: "/resources",
            gradient: "gradient-card",
            badge: "Multilingual",
        },
        {
            icon: Users,
            title: "Peer Support Community",
            description:
                "Connect with fellow students in a safe, moderated environment for peer-to-peer support and encouragement.",
            path: "/community",
            gradient: "gradient-primary",
            badge: "Moderated 24/7",
        },
        {
            icon: BarChart3,
            title: "Analytics Dashboard",
            description:
                "Anonymous insights into student mental health trends and platform engagement for administrators.",
            path: "/admin",
            gradient: "gradient-accent",
            badge: "Admin Only",
        },
    ];

    const stats = [
        { number: "2,847", label: "Students Supported", icon: Users },
        { number: "1,234", label: "Meditation Sessions", icon: Heart },
        { number: "456", label: "Counselor Bookings", icon: Calendar },
        { number: "89%", label: "User Satisfaction", icon: Star },
    ];

    const benefits = [
        "Complete anonymity and data privacy protection",
        "24/7 availability for crisis support",
        "Multi-language support for diverse student populations",
        "Evidence-based mental health interventions",
        "Trained volunteer moderators for community safety",
        "Integration with campus counseling services",
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative gradient-hero overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Peaceful wellness environment"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-16 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">

                        {/* Left Column - Text and Buttons */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left scroll-animate opacity-0 translate-y-8 lg:px-8">
                            <div className="max-w-xl mx-auto lg:mx-0 space-y-6">
                                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                                    Welcome <span className="gradient-primary bg-clip-text text-transparent">Saathi!</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    College can be chaotic—but support shouldn't be. <br />
                                    We break the silence around mental health, especially where support is scarce. <br />
                                    Your journey matters, and you're never alone with{" "}
                                    <span className="font-semibold text-primary">Saathi</span>.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/chat">
                                        <Button size="lg" className="gradient-primary shadow-glow group">
                                            Start AI Support Chat
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link to="/booking">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-primary/20 hover:border-primary"
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Book a Counselor
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-4 w-4 text-success" />
                                        <span>100% Confidential</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span>Multiple Languages</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Heart className="h-4 w-4 text-accent" />
                                        <span>24/7 Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - GIF Image */}
                        <div className="hidden lg:flex justify-center items-center scroll-animate opacity-0 translate-y-8">
                            <img
                                src={goluImage}
                                alt="Cute animated character"
                                className="max-w-[500px] w-full h-auto"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* ✅ ADDED: Stats Section */}
            <section className="py-16 bg-background">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card
                                    key={index}
                                    className="gradient-card border-border shadow-soft hover:shadow-glow transition-gentle breathe scroll-animate opacity-0 translate-y-8"
                                    style={{ animationDelay: `${index * 0.3}s` }}
                                >
                                    <CardContent className="p-6 text-center">
                                        <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                        <div className="text-2xl font-bold text-foreground">
                                            {stat.number}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 scroll-animate opacity-0 translate-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Comprehensive Mental Health Support
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Saathi combines AI technology, professional expertise, and peer community to provide
                            holistic mental wellness support tailored for student life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Link key={index} to={feature.path}>
                                    <Card
                                        className="gradient-card border-border shadow-soft hover:shadow-glow transition-gentle group cursor-pointer h-full scroll-animate opacity-0 translate-y-8"
                                        // ✅ FIXED: Correct template literal syntax
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                {/* ✅ FIXED: Correct template literal syntax */}
                                                <div className={`p-3 rounded-lg ${feature.gradient}`}>
                                                    <Icon className="h-6 w-6 text-primary-foreground" />
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {feature.badge}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                                                Learn More
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 gradient-hero">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column */}
                    <div className="space-y-8 scroll-animate opacity-0 translate-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                            Why Students Choose Saathi
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Built specifically for the unique challenges of student life, with privacy,
                            accessibility, and cultural sensitivity at its core.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/resources">
                                <Button variant="outline" className="border-primary/20 hover:border-primary">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Explore Resources
                                </Button>
                            </Link>
                            <Link to="/community">
                                <Button variant="outline" className="border-primary/20 hover:border-primary">
                                    <Users className="h-4 w-4 mr-2" />
                                    Join Community
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Testimonials */}
                    <div className="space-y-6">
                        <Card className="gradient-card border-border shadow-soft glow-pulse">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Anonymous Student</div>
                                        <div className="text-sm text-muted-foreground">Computer Science, 3rd Year</div>
                                    </div>
                                </div>
                                <p className="text-foreground italic">
                                    "Saathi helped me through my worst anxiety episodes during finals. The AI chat was
                                    available when I needed it most, and connecting with a counselor was seamless and
                                    completely confidential."
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="gradient-card border-border shadow-soft">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Heart className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Campus Counselor</div>
                                        <div className="text-sm text-muted-foreground">Mental Health Professional</div>
                                    </div>
                                </div>
                                <p className="text-foreground italic">
                                    "The platform bridges the gap between students needing immediate support and
                                    professional services. It's become an invaluable tool for early intervention and
                                    ongoing care."
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Emergency Helpline Section */}
            <section className="py-16 bg-destructive/5">
                <div className="max-w-xl mx-auto px-4">
                    <Card className="gradient-card border-destructive/20 shadow-warm">
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold text-destructive mb-2 text-center">
                                Need Immediate Help?
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 text-center">
                                If you're experiencing a mental health crisis, please call or text now.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                {/* Call Button */}
                                <a href="tel:18008914416" className="w-full">
                                    <Button variant="destructive" className="w-full">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call: +91 1800-891-4416
                                    </Button>
                                </a>
                                {/* SMS Button */}
                                <a href="sms:18008914416?body=I need immediate help. Please call me." className="w-full">
                                    <Button variant="destructive" className="w-full">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Send a Text
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default Index;