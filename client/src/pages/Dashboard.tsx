import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import {
  Code2,
  Plus,
  Trash2,
  Copy,
  Download,
  Send,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
  Brain,
  Shield,
  GitBranch,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const [codeContent, setCodeContent] = useState(`// Welcome to AI Coding Assistant
// Start typing or paste your code here

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
`);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI coding assistant. Paste your code above and I'll help you analyze, optimize, and improve it. You can ask me questions about your code, request refactoring suggestions, or help with debugging.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const projects = [
    { id: "1", name: "Web App", language: "JavaScript" },
    { id: "2", name: "API Server", language: "Python" },
    { id: "3", name: "Mobile App", language: "React Native" },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've analyzed your code. Here are my suggestions:\n\n1. **Performance**: Consider using memoization for recursive functions\n2. **Readability**: Add JSDoc comments for better documentation\n3. **Testing**: Add unit tests to improve code coverage`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } border-r border-border bg-card transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-6 w-6" />
            <span className="font-bold text-foreground">{APP_TITLE}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Projects</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedProject === project.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.language}</p>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Brain className="h-4 w-4" />
                Analyze Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Zap className="h-4 w-4" />
                Optimize
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Shield className="h-4 w-4" />
                Security Check
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <GitBranch className="h-4 w-4" />
                Refactor
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4 space-y-2">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              {selectedProject ? projects.find((p) => p.id === selectedProject)?.name : "Welcome"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name || "Developer"}!</span>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name || "User avatar"}
              className="h-8 w-8 rounded-full"
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex gap-4 p-4">
          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col border border-border">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-accent" />
                    <div>
                      <CardTitle>Code Editor</CardTitle>
                      <CardDescription>Paste or write your code here</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Copy">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="Paste your code here..."
                  className="h-full resize-none rounded-none border-0 font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Section */}
          <div className="w-96 flex flex-col">
            <Card className="flex-1 flex flex-col border border-border">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  <div>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Ask questions about your code</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Chat Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={chatInput || ""}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about your code..."
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
