"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

interface PropertyCardProps {
  property: {
    id: number
    address: string
    price: string
    image: string
    images: string[]
    beds: number
    baths: number
    sqft: number
    status: string
  }
  isSubject?: boolean
  onClick: () => void
}

export function PropertyCard({ property, isSubject = false, onClick }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative aspect-video cursor-pointer" onClick={onClick}>
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.address}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2">{property.status}</Badge>
        {isSubject && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="text-xs font-medium">Subject</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1">{property.address}</h3>
        <p className="text-lg font-bold mt-1">{property.price}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <span>{property.beds} beds</span>
          <span>•</span>
          <span>{property.baths} baths</span>
          <span>•</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
