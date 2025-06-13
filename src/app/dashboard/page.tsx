"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Shield,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Code,
  DollarSign,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Ban,
  ExternalLink,
  Clock,
  Menu,
} from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  type Status =
  | "completed"
  | "pending"
  | "active"
  | "investigating"
  | "takedown_sent"
  | "resolved"
  | "successful";

  type Severity = "high" | "medium" | "low";


  // Mock data for KPIs
  const kpis = {
    revenue: {
      current: 15420,
      previous: 12890,
      change: 19.6,
      trend: "up",
    },
    uploads: {
      current: 47,
      previous: 52,
      change: -9.6,
      trend: "down",
    },
    licenses: {
      current: 234,
      previous: 198,
      change: 18.2,
      trend: "up",
    },
    infringements: {
      current: 8,
      previous: 12,
      change: -33.3,
      trend: "down",
    },
    takedowns: {
      current: 6,
      previous: 9,
      change: -33.3,
      trend: "down",
    },
  }

  // Mock data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 8500, licenses: 45 },
    { month: "Feb", revenue: 9200, licenses: 52 },
    { month: "Mar", revenue: 10800, licenses: 61 },
    { month: "Apr", revenue: 11500, licenses: 68 },
    { month: "May", revenue: 12890, licenses: 72 },
    { month: "Jun", revenue: 15420, licenses: 89 },
  ]

  // Mock data for license types
  const licenseData = [
    { name: "Standard", value: 156, color: "#3b82f6" },
    { name: "Extended", value: 67, color: "#10b981" },
    { name: "Exclusive", value: 11, color: "#f59e0b" },
  ]

  // Mock data for recent sales
  const recentSales = [
    {
      id: 1,
      asset: "Modern Logo Design Kit",
      buyer: "john.doe@email.com",
      license: "Standard",
      amount: 49,
      date: "2024-01-20",
      status: "completed",
    },
    {
      id: 2,
      asset: "React Dashboard Components",
      buyer: "sarah.wilson@company.com",
      license: "Extended",
      amount: 129,
      date: "2024-01-19",
      status: "completed",
    },
    {
      id: 3,
      asset: "Marketing Video Templates",
      buyer: "mike.chen@startup.io",
      license: "Standard",
      amount: 89,
      date: "2024-01-18",
      status: "pending",
    },
    {
      id: 4,
      asset: "UI Design System",
      buyer: "emma.davis@agency.com",
      license: "Exclusive",
      amount: 499,
      date: "2024-01-17",
      status: "completed",
    },
  ]

  // Mock data for recent uploads
  const recentUploads = [
    {
      id: 1,
      title: "E-commerce Website Template",
      type: "code",
      status: "active",
      views: 45,
      date: "2024-01-20",
      icon: Code,
    },
    {
      id: 2,
      title: "Brand Identity Package",
      type: "design",
      status: "pending",
      views: 12,
      date: "2024-01-19",
      icon: ImageIcon,
    },
    {
      id: 3,
      title: "Product Demo Video",
      type: "video",
      status: "active",
      views: 78,
      date: "2024-01-18",
      icon: Video,
    },
    {
      id: 4,
      title: "Financial Model Spreadsheet",
      type: "document",
      status: "active",
      views: 23,
      date: "2024-01-17",
      icon: FileText,
    },
  ]

  // Mock data for infringements
  const infringements = [
    {
      id: 1,
      asset: "Modern Logo Design Kit",
      platform: "Unauthorized Website",
      url: "https://fake-site.com/stolen-logos",
      detected: "2024-01-19",
      status: "investigating",
      severity: "high",
    },
    {
      id: 2,
      asset: "React Dashboard Components",
      platform: "GitHub Repository",
      url: "https://github.com/user/stolen-components",
      detected: "2024-01-18",
      status: "takedown_sent",
      severity: "medium",
    },
    {
      id: 3,
      asset: "Marketing Video Templates",
      platform: "YouTube",
      url: "https://youtube.com/watch?v=stolen-video",
      detected: "2024-01-17",
      status: "resolved",
      severity: "low",
    },
  ]

  // Mock data for takedown logs
  const takedownLogs = [
    {
      id: 1,
      asset: "UI Design System",
      platform: "Dribbble",
      requestDate: "2024-01-15",
      responseDate: "2024-01-17",
      status: "successful",
      method: "DMCA",
    },
    {
      id: 2,
      asset: "Business Plan Template",
      platform: "SlideShare",
      requestDate: "2024-01-12",
      responseDate: "2024-01-14",
      status: "successful",
      method: "Platform Report",
    },
    {
      id: 3,
      asset: "Modern Logo Design Kit",
      platform: "Pinterest",
      requestDate: "2024-01-10",
      responseDate: null,
      status: "pending",
      method: "DMCA",
    },
  ]

  const getStatusBadge = (status: Status) => {
  const variants: Record<Status, "default" | "destructive" | "outline" | "secondary"> = {
    completed: "default",
    pending: "secondary",
    active: "default",
    investigating: "destructive",
    takedown_sent: "secondary",
    resolved: "default",
    successful: "default",
  };

  return (
    <Badge variant={variants[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
};


const getSeverityBadge = (severity: Severity) => {
  const variants: Record<Severity, "default" | "destructive" | "outline" | "secondary"> = {
    high: "destructive",
    medium: "secondary",
    low: "outline",
  };

  return (
    <Badge variant={variants[severity]}>
      {severity}
    </Badge>
  );
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">IP Vault</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                Home
              </Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 text-sm">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-blue-600 font-medium text-sm">
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link href="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="sm:hidden">
                <Link href="/upload">
                  <Upload className="h-4 w-4" />
                </Link>
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t bg-white py-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">
                  Home
                </Link>
                <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 px-2 py-1 text-sm">
                  Marketplace
                </Link>
                <Link href="/dashboard" className="text-blue-600 font-medium px-2 py-1 text-sm">
                  Dashboard
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">${kpis.revenue.current.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {kpis.revenue.trend === "up" ? (
                  <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600 mr-1" />
                )}
                <span className={kpis.revenue.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {kpis.revenue.change > 0 ? "+" : ""}
                  {kpis.revenue.change}%
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Uploads</CardTitle>
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{kpis.uploads.current}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600 mr-1" />
                <span className="text-red-600">{kpis.uploads.change}%</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Licenses</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{kpis.licenses.current}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{kpis.licenses.change}%</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Infringements</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{kpis.infringements.current}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-green-600 mr-1" />
                <span className="text-green-600">{kpis.infringements.change}%</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Takedowns</CardTitle>
              <Ban className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{kpis.takedowns.current}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-green-600 mr-1" />
                <span className="text-green-600">{kpis.takedowns.change}%</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          {/* Revenue Chart */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Revenue Over Time</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Monthly revenue and license sales</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px] sm:h-[250px] lg:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* License Types Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">License Types</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribution breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  standard: {
                    label: "Standard",
                    color: "#3b82f6",
                  },
                  extended: {
                    label: "Extended",
                    color: "#10b981",
                  },
                  exclusive: {
                    label: "Exclusive",
                    color: "#f59e0b",
                  },
                }}
                className="h-[200px] sm:h-[250px] lg:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={licenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {licenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="sales" className="text-xs sm:text-sm px-2 py-2">
              Sales
            </TabsTrigger>
            <TabsTrigger value="uploads" className="text-xs sm:text-sm px-2 py-2">
              Uploads
            </TabsTrigger>
            <TabsTrigger value="infringements" className="text-xs sm:text-sm px-2 py-2">
              Infringements
            </TabsTrigger>
            <TabsTrigger value="takedowns" className="text-xs sm:text-sm px-2 py-2">
              Takedowns
            </TabsTrigger>
          </TabsList>

          {/* Recent Sales Table */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Sales</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest transactions and purchases</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">Asset</TableHead>
                        <TableHead className="text-xs font-medium hidden sm:table-cell">Buyer</TableHead>
                        <TableHead className="text-xs font-medium">License</TableHead>
                        <TableHead className="text-xs font-medium">Amount</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-xs font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSales.slice(0, 4).map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium text-xs sm:text-sm max-w-[120px] sm:max-w-none">
                            <div className="truncate">{sale.asset}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="truncate max-w-[150px]">{sale.buyer}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{sale.license}</TableCell>
                          <TableCell className="text-green-600 font-semibold text-xs sm:text-sm">
                            ${sale.amount}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{sale.date}</TableCell>
                          <TableCell>{getStatusBadge(sale.status as Status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Uploads Table */}
          <TabsContent value="uploads">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Uploads</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your latest asset uploads</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">Asset</TableHead>
                        <TableHead className="text-xs font-medium hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs font-medium">Status</TableHead>
                        <TableHead className="text-xs font-medium">Views</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUploads.map((upload) => {
                        const IconComponent = upload.icon
                        return (
                          <TableRow key={upload.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                                  {upload.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize text-xs sm:text-sm hidden sm:table-cell">
                              {upload.type}
                            </TableCell>
                            <TableCell>{getStatusBadge(upload.status as Status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-2 w-2 sm:h-3 sm:w-3 text-gray-400" />
                                <span className="text-xs sm:text-sm">{upload.views}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{upload.date}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infringements Table */}
          <TabsContent value="infringements">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">IP Infringements</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Detected unauthorized usage</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">Asset</TableHead>
                        <TableHead className="text-xs font-medium hidden sm:table-cell">Platform</TableHead>
                        <TableHead className="text-xs font-medium">Severity</TableHead>
                        <TableHead className="text-xs font-medium">Status</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell">Detected</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infringements.map((infringement) => (
                        <TableRow key={infringement.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="truncate max-w-[120px] sm:max-w-none">{infringement.asset}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="flex items-center space-x-2">
                              <span className="truncate max-w-[100px]">{infringement.platform}</span>
                              <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                                <a href={infringement.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{getSeverityBadge(infringement.severity as Severity)}</TableCell>
                          <TableCell>{getStatusBadge(infringement.status as Status)}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {infringement.detected}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Takedown Logs Table */}
          <TabsContent value="takedowns">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Takedown Requests</CardTitle>
                <CardDescription className="text-xs sm:text-sm">DMCA and platform requests</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">Asset</TableHead>
                        <TableHead className="text-xs font-medium hidden sm:table-cell">Platform</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell">Method</TableHead>
                        <TableHead className="text-xs font-medium">Status</TableHead>
                        <TableHead className="text-xs font-medium hidden lg:table-cell">Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {takedownLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="truncate max-w-[120px] sm:max-w-none">{log.asset}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{log.platform}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{log.method}</TableCell>
                          <TableCell>{getStatusBadge(log.status as Status)}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {log.responseDate ? (
                              log.responseDate
                            ) : (
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                                <span>Pending</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
