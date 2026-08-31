import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AppointmentDetailLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
        <Button size="sm" disabled>
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          Edit Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardDescription>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex items-center space-x-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="h-px bg-gray-200 my-2" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="flex flex-col space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 flex-1 rounded-md" />
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="h-px bg-gray-200 my-2" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>

                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="h-px bg-gray-200 my-2" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-32 rounded-md mt-2" />
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Skeleton className="h-10 w-48 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
