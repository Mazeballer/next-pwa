"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, MoreHorizontal, ArrowUpDown, Phone, ExternalLink } from "lucide-react"
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
import { Logo } from "@/components/ui/custom/logo"
import { toast } from "sonner"

// Define the interface for the lead data structure based on Google Sheet
interface Lead {
  ID: string
  Timestamp: string
  By: string
  Name: string
  "Contact Number": string
  Company: string
  Position: string
  "Event Name": string
  "Event Date": string
  "Lead Potential": string
  "Contact Again Date": string
  "Potential Rating": string
  "Value of Business Estimation": string
  "Name Card"?: string
  "Any Upload"?: string
  "Whatsapp Number"?: string
  Trigger?: string
}

// Sample data based on the Google Sheet structure
const sampleLeads: Lead[] = [
  {
    ID: "b77a55d6-b45e-416a-b863-5a0cc346b589",
    Timestamp: "2025-03-20 19:08:34",
    By: "kh",
    Name: "Vinod Subramaniam",
    "Contact Number": "0149235768",
    Company: "Huawei Technologies (Malaysia) Sdn. Bhd.",
    Position: "Cloud Support Engineer",
    "Event Name": "AWS User Group Meetup",
    "Event Date": "2025-03-20",
    "Lead Potential": "Venue,Business Partnership,Event Speaker,AI Business,Talent Sourcing Business,Candidates",
    "Contact Again Date": "2025-03-22",
    "Potential Rating": "9",
    "Value of Business Estimation": "RM5-10K",
    "Whatsapp Number": "",
  },
  {
    ID: "b7ae1b57-5b19-4419-8849-4106a4c51f33",
    Timestamp: "2025-03-20 19:35:33",
    By: "EC",
    Name: "Vandyck Lai",
    "Contact Number": "60129812215",
    Company: "Exponent AI",
    Position: "AI Agent Engineer",
    "Event Name": "AWS",
    "Event Date": "2025-03-20",
    "Lead Potential": "Event Speaker",
    "Contact Again Date": "2025-03-20",
    "Potential Rating": "8",
    "Value of Business Estimation": "< RM5K",
    "Name Card":
      "https://firebasestorage.googleapis.com/v0/b/apt-forms.appspot.com/o/files%2FName%20Card_1742470529997_image.jpg?alt=media&token=58675f92-36e6-49f6-a5df-e176042e1521",
  },
  {
    ID: "c8ba66e7-c45f-427b-9a74-6b1dd5c47e90",
    Timestamp: "2025-03-21 10:15:22",
    By: "JW",
    Name: "Sarah Johnson",
    "Contact Number": "0123456789",
    Company: "Microsoft Malaysia",
    Position: "Solutions Architect",
    "Event Name": "Cloud Summit 2025",
    "Event Date": "2025-03-18",
    "Lead Potential": "Business Partnership,AI Business",
    "Contact Again Date": "2025-03-25",
    "Potential Rating": "7",
    "Value of Business Estimation": "RM10-20K",
    "Whatsapp Number": "0123456789",
  },
  {
    ID: "d9cb77f8-d56g-538c-0b85-7c2ee6d58f01",
    Timestamp: "2025-03-22 14:30:45",
    By: "TL",
    Name: "Michael Wong",
    "Contact Number": "0187654321",
    Company: "IBM Malaysia",
    Position: "Technical Lead",
    "Event Name": "DevOps Conference",
    "Event Date": "2025-03-21",
    "Lead Potential": "Talent Sourcing Business,Event Speaker",
    "Contact Again Date": "2025-03-28",
    "Potential Rating": "6",
    "Value of Business Estimation": "< RM5K",
    "Whatsapp Number": "0187654321",
  },
  {
    ID: "e0dc88g9-e67h-649d-1c96-8d3ff7e69g12",
    Timestamp: "2025-03-23 09:45:10",
    By: "AZ",
    Name: "Priya Sharma",
    "Contact Number": "0163334444",
    Company: "Google Cloud",
    Position: "Senior Developer Advocate",
    "Event Name": "Google Cloud Next",
    "Event Date": "2025-03-22",
    "Lead Potential": "Event Speaker,Business Partnership,Venue",
    "Contact Again Date": "2025-03-30",
    "Potential Rating": "10",
    "Value of Business Estimation": "> RM20K",
    "Name Card": "https://example.com/namecard/priya.jpg",
    "Whatsapp Number": "0163334444",
  },
]

export function EventLeadsSearch() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [searchResults, setSearchResults] = useState<Lead[]>(sampleLeads)
  const [filteredResults, setFilteredResults] = useState<Lead[]>(sampleLeads)
  const [sortColumn, setSortColumn] = useState<keyof Lead | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isSearching, setIsSearching] = useState(false)
  const [nameFilter, setNameFilter] = useState("")
  const [byFilter, setByFilter] = useState("")
  const [eventNameFilter, setEventNameFilter] = useState("")
  const [potentialRatingFilter, setPotentialRatingFilter] = useState("")

  // Function to fetch data from Google Sheets (placeholder for now)
  const fetchData = async () => {
    try {
      // In a real implementation, you would fetch data from your Google Sheets API
      // const response = await fetch('/api/google-sheets');
      // const data = await response.json();
      // setSearchResults(data);
      // setFilteredResults(data);

      // For now, we'll use the sample data
      setSearchResults(sampleLeads)
      setFilteredResults(sampleLeads)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data. Please try again.")
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    setIsSearching(true)

    // Filter the results based on the search criteria
    let results = [...searchResults]

    if (nameFilter) {
      results = results.filter((lead) => lead.Name.toLowerCase().includes(nameFilter.toLowerCase()))
    }

    if (byFilter) {
      results = results.filter((lead) => lead.By === byFilter)
    }

    if (eventNameFilter) {
      results = results.filter((lead) => lead["Event Name"].toLowerCase().includes(eventNameFilter.toLowerCase()))
    }

    if (potentialRatingFilter) {
      switch (potentialRatingFilter) {
        case "high":
          results = results.filter((lead) => Number.parseInt(lead["Potential Rating"]) >= 8)
          break
        case "medium":
          results = results.filter(
            (lead) => Number.parseInt(lead["Potential Rating"]) >= 5 && Number.parseInt(lead["Potential Rating"]) <= 7,
          )
          break
        case "low":
          results = results.filter((lead) => Number.parseInt(lead["Potential Rating"]) < 5)
          break
        // "all" case doesn't need filtering
      }
    }

    if (dateFrom) {
      results = results.filter((lead) => {
        const eventDate = new Date(lead["Event Date"])
        return eventDate >= dateFrom
      })
    }

    if (dateTo) {
      results = results.filter((lead) => {
        const eventDate = new Date(lead["Event Date"])
        return eventDate <= dateTo
      })
    }

    // Simulate search delay
    setTimeout(() => {
      setFilteredResults(results)
      setIsSearching(false)
      toast.success(`Found ${results.length} leads matching your criteria`)
    }, 500)
  }

  const handleSort = (column: keyof Lead) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }

    // Sort the results
    const sortedResults = [...filteredResults].sort((a, b) => {
      const aValue = a[column]
      const bValue = b[column]

      if (typeof aValue === "string" && typeof bValue === "string") {
        // Handle potential rating as a number if the column is "Potential Rating"
        if (column === "Potential Rating") {
          return sortDirection === "asc"
            ? Number.parseInt(aValue) - Number.parseInt(bValue)
            : Number.parseInt(bValue) - Number.parseInt(aValue)
        }

        // Handle dates if the column contains date information
        if (column === "Event Date" || column === "Contact Again Date" || column === "Timestamp") {
          const aDate = new Date(aValue)
          const bDate = new Date(bValue)
          return sortDirection === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
        }

        // Default string comparison
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    setFilteredResults(sortedResults)
  }

  const getPotentialRatingColor = (rating: string) => {
    const numRating = Number.parseInt(rating)
    if (numRating >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (numRating >= 5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getValueEstimationColor = (value: string) => {
    if (value.includes(">") || value.includes("20K"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (value.includes("10K")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    if (value.includes("5K")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }

  const formatLeadPotential = (potential: string) => {
    return potential.split(",").map((item, index) => (
      <Badge key={index} variant="outline" className="mr-1 mb-1">
        {item.trim()}
      </Badge>
    ))
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo width={100} height={40} />
          <h1 className="text-2xl font-bold">Leads Database</h1>
        </div>
        <ModeToggle />
      </div>

      {/* Date Range */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <div className="space-y-2 w-full md:w-auto">
          <Label>Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {dateFrom ? format(dateFrom, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 w-full md:w-auto">
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
            <Input
              id="name"
              placeholder="Search by name..."
              className="pl-8"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
        </div>

        {/* By Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="by">By</Label>
          <Select value={byFilter} onValueChange={setByFilter}>
            <SelectTrigger id="by">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="kh">KH</SelectItem>
              <SelectItem value="EC">EC</SelectItem>
              <SelectItem value="JW">JW</SelectItem>
              <SelectItem value="TL">TL</SelectItem>
              <SelectItem value="AZ">AZ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Name */}
        <div className="space-y-2">
          <Label htmlFor="event">Event Name</Label>
          <Input
            id="event"
            placeholder="Search by event..."
            value={eventNameFilter}
            onChange={(e) => setEventNameFilter(e.target.value)}
          />
        </div>

        {/* Potential Score */}
        <div className="space-y-2">
          <Label htmlFor="score">Potential Rating</Label>
          <Select value={potentialRatingFilter} onValueChange={setPotentialRatingFilter}>
            <SelectTrigger id="score">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="high">High (8-10)</SelectItem>
              <SelectItem value="medium">Medium (5-7)</SelectItem>
              <SelectItem value="low">Low (1-4)</SelectItem>
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
          <p className="text-sm text-muted-foreground">{filteredResults.length} leads found</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("Name")}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("Company")}>
                      Company
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("Event Name")}>
                      Event
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("Event Date")}>
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      className="p-0 h-8 font-medium"
                      onClick={() => handleSort("Potential Rating")}
                    >
                      Rating
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((lead) => (
                  <TableRow key={lead.ID}>
                    <TableCell className="font-medium">
                      <div>{lead.Name}</div>
                      <div className="text-sm text-muted-foreground">{lead.Position}</div>
                    </TableCell>
                    <TableCell>{lead.Company}</TableCell>
                    <TableCell>{lead["Event Name"]}</TableCell>
                    <TableCell>{format(new Date(lead["Event Date"]), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn("font-medium", getPotentialRatingColor(lead["Potential Rating"]))}
                      >
                        {lead["Potential Rating"]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn("font-medium", getValueEstimationColor(lead["Value of Business Estimation"]))}
                      >
                        {lead["Value of Business Estimation"]}
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
                          <DropdownMenuItem>
                            <a href={`tel:${lead["Contact Number"]}`} className="flex items-center w-full">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </a>
                          </DropdownMenuItem>
                          {lead["Name Card"] && (
                            <DropdownMenuItem>
                              <a
                                href={lead["Name Card"]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-full"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Name Card
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredResults.map((lead) => (
            <Card key={lead.ID}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{lead.Name}</CardTitle>
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
                      <DropdownMenuItem>
                        <a href={`tel:${lead["Contact Number"]}`} className="flex items-center w-full">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </a>
                      </DropdownMenuItem>
                      {lead["Name Card"] && (
                        <DropdownMenuItem>
                          <a
                            href={lead["Name Card"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Name Card
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  {lead.Position} at {lead.Company}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="font-medium">Event:</span> {lead["Event Name"]}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {format(new Date(lead["Event Date"]), "MMM d, yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>{" "}
                    <Badge
                      variant="outline"
                      className={cn("font-medium", getPotentialRatingColor(lead["Potential Rating"]))}
                    >
                      {lead["Potential Rating"]}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Value:</span>{" "}
                    <Badge
                      variant="outline"
                      className={cn("font-medium", getValueEstimationColor(lead["Value of Business Estimation"]))}
                    >
                      {lead["Value of Business Estimation"]}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Lead Potential:</span>
                  <div className="flex flex-wrap mt-1">{formatLeadPotential(lead["Lead Potential"])}</div>
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
