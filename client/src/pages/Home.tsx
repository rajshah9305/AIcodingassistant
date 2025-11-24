import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, Zap, Code2, Brain, GitBranch, Shield, Sparkles, Terminal } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">{APP_TITLE}</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#capabilities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Capabilities
            </a>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-2">
              <span className="text-sm font-semibold text-accent flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Advanced AI-Powered Development
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
              Code Smarter with AI
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Augment your coding with intelligent suggestions, real-time analysis, and advanced debugging. Experience the future of development.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to write better code, faster
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Code Analysis */}
            <Card className="border border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Intelligent Analysis</CardTitle>
                <CardDescription>Real-time code quality metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get instant feedback on complexity, maintainability, and performance with AI-powered analysis.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2: Code Augmentation */}
            <Card className="border border-border hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                  <Code2 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Code Augmentation</CardTitle>
                <CardDescription>Smart suggestions and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Context-aware suggestions that understand your codebase and provide intelligent completions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: Debugging */}
            <Card className="border border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                  <Terminal className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Advanced Debugging</CardTitle>
                <CardDescription>Root cause analysis and fixes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identify bugs quickly with AI-assisted debugging and get actionable solutions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4: Refactoring */}
            <Card className="border border-border hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                  <GitBranch className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Automated Refactoring</CardTitle>
                <CardDescription>Improve code structure automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get refactoring recommendations with before/after previews to improve your codebase.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5: Security */}
            <Card className="border border-border hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Security Scanning</CardTitle>
                <CardDescription>Vulnerability detection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identify security vulnerabilities and get recommendations to keep your code safe.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6: Performance */}
            <Card className="border border-border hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Performance Optimization</CardTitle>
                <CardDescription>Speed up your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get actionable suggestions to optimize performance and reduce bottlenecks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="border-t border-border bg-card py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Advanced Capabilities</h2>
            <p className="text-lg text-muted-foreground">
              Built for modern development workflows
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border p-6 hover:border-accent/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Multi-Language Support</h3>
              <p className="text-muted-foreground">
                Support for JavaScript, Python, Java, C++, Go, Rust, and more. Write code in any language with intelligent assistance.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6 hover:border-secondary/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Real-Time Collaboration</h3>
              <p className="text-muted-foreground">
                Work together with your team in real-time with shared code workspaces and instant feedback.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6 hover:border-accent/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Code Visualization</h3>
              <p className="text-muted-foreground">
                Visualize data flow, dependencies, and code structure with interactive diagrams and graphs.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6 hover:border-secondary/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Test Generation</h3>
              <p className="text-muted-foreground">
                Automatically generate unit tests and improve code coverage with AI-powered test creation.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6 hover:border-accent/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Git Integration</h3>
              <p className="text-muted-foreground">
                Seamless GitHub integration for commit assistance, PR reviews, and code suggestions.
              </p>
            </div>

            <div className="rounded-lg border border-border p-6 hover:border-secondary/50 transition-colors">
              <h3 className="mb-3 text-lg font-semibold text-foreground">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Ask questions about your code and get detailed explanations, solutions, and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-r from-accent/10 to-secondary/10 p-12 text-center border border-accent/20">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Transform Your Coding?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join developers who are already coding smarter with AI assistance.
            </p>
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()} className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-6 w-6" />
              <span className="font-semibold text-foreground">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 {APP_TITLE}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
