import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function UserDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <Button size="sm" disabled>
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          Edit User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <CardTitle className="text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
            </CardTitle>
            <CardDescription className="text-center">
              <Skeleton className="h-4 w-40 mx-auto mt-2" />
            </CardDescription>
            <div className="flex justify-center mt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-start">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="mt-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="ml-6 mt-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48 mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2 mb-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 flex-1 rounded-md" />
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3">
                    <div className="grid grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                  <div className="divide-y">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="p-3">
                        <div className="grid grid-cols-5 gap-4">
                          {[1, 2, 3, 4, 5].map((j) => (
                            <Skeleton key={`${i}-${j}`} className="h-4 w-full" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="w-full flex justify-between">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
