import { useQuery } from "@tanstack/react-query"
import instanceClient from "../../../../configs/instance"
import { useParams } from "react-router-dom"

const Content = () => {
    const {id} = useParams()
    const {data:tour} = useQuery({
        queryKey:['tour'],
        queryFn: () => instanceClient.get(`tour/${id}`)
    })
    const tours = tour?.data?.tour
  return (
      <section className="space-y-4">
          <h2 className="text-2xl font-bold">Giới thiệu</h2>
          <p>
              <div
                  dangerouslySetInnerHTML={{
                      __html: tours?.descriptionTour || "",
                  }}
              />
          </p>
      </section>
  )
}

export default Content
