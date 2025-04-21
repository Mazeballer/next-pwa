"use client"

import { useState } from "react"
import { Search, Calendar, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/ui/custom/mode-toggle"

// Add mock data for the search results
const mockLeads = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    eventName: "Tech Conference 2023",
    date: new Date("2023-11-15"),
    score: 9,
    status: "New",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    eventName: "Marketing Summit",
    date: new Date("2023-10-22"),
    score: 7,
    status: "Contacted",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    eventName: "Product Launch",
    date: new Date("2023-12-05"),
    score: 8,
    status: "Qualified",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    eventName: "Industry Meetup",
    date: new Date("2023-11-30"),
    score: 5,
    status: "New",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    eventName: "Annual Conference",
    date: new Date("2023-09-18"),
    score: 6,
    status: "Contacted",
  },
]

export function EventLeadsSearch() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [searchResults, setSearchResults] = useState(mockLeads)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setSearchResults(mockLeads)
      setIsSearching(false)
    }, 500)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }

    // Sort the results
    const sortedResults = [...searchResults].sort((a, b) => {
      const aValue = a[column as keyof typeof a]
      const bValue = b[column as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    setSearchResults(sortedResults)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800"
    if (score >= 5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Contacted":
        return "bg-purple-100 text-purple-800"
      case "Qualified":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Leads</h1>
         <ModeToggle />
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <div className="space-y-2">
          <Label>Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
              >
                <Calendar className="h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Name Search */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id="name" placeholder="Search by name..." className="pl-8" />
          </div>
        </div>

        {/* By Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="by">By</Label>
          <Select>
            <SelectTrigger id="by">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Name */}
        <div className="space-y-2">
          <Label htmlFor="event">Event Name</Label>
          <Input id="event" placeholder="Search by event..." />
        </div>

        {/* Potential Score */}
        <div className="space-y-2">
          <Label htmlFor="score">Potential Score</Label>
          <Select>
            <SelectTrigger id="score">
              <SelectValue placeholder="Select score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (8-10)</SelectItem>
              <SelectItem value="medium">Medium (5-7)</SelectItem>
              <SelectItem value="low">Low (1-4)</SelectItem>
              <SelectItem value="all">All Scores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button className="w-full md:w-auto" onClick={handleSearch} disabled={isSearching}>
        <Search className="mr-2 h-4 w-4" />
        {isSearching ? "Searching..." : "Search Leads"}
      </Button>

      {/* Results Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-sm text-muted-foreground">{searchResults.length} leads found</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("name")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("eventName")}>
                    Event
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("date")}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("score")}>
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div>{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                  </TableCell>
                  <TableCell>{lead.eventName}</TableCell>
                  <TableCell>{format(lead.date, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("font-medium", getScoreColor(lead.score))}>
                      {lead.score}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("font-medium", getStatusColor(lead.status))}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem>Contact Lead</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {searchResults.map((lead) => (
            <Card key={lead.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                      <DropdownMenuItem>Contact Lead</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{lead.email}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Event:</span> {lead.eventName}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {format(lead.date, "MMM d, yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">Score:</span>{" "}
                    <Badge variant="outline" className={cn("font-medium", getScoreColor(lead.score))}>
                      {lead.score}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <Badge variant="outline" className={cn("font-medium", getStatusColor(lead.status))}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
