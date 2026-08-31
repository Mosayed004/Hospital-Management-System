import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function InvoiceDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Billing
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            Print
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            Download PDF
          </Button>
          <Button size="sm" disabled>
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  <Skeleton className="h-8 w-48" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardDescription>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <div className="mt-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-32 ml-auto mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 ml-auto" />
                  <Skeleton className="h-4 w-40 ml-auto" />
                  <Skeleton className="h-5 w-40 ml-auto" />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <div className="mb-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3">
                  <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3">
                      <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-40 rounded-md" />
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="h-px bg-gray-200 my-2" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="h-px bg-gray-200 my-2" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="h-px bg-gray-200 my-2" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
