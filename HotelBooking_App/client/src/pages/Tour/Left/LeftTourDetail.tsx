import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import instanceClient from "../../../../configs/instance";
import { useEffect, useState } from "react";

const LeftTourDetail = () => {
    const { id } = useParams();
    const { data: tour } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => instanceClient.get(`/tour/${id}`)
    })
    console.log(tour?.data?.tour.imageTour[0]);
    const [mainImage, setMainImage] = useState(tour?.data?.tour?.imageTour[0]);
    const handleThumbnailClick = (src: string) => {
        setMainImage(src);
    };
    useEffect(() => {
        if (tour?.data?.tour?.imageTour?.length > 0) {
            setMainImage(tour?.data.tour.imageTour[0]);
        }
    }, [tour]);
  return (
      <div className="rounded lg:col-span-2">
          <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-4xl">
                  <img
                      src={mainImage}
                      className="w-full rounded-lg"
                      alt="Main"
                  />
              </div>

              <div className="grid grid-cols-5 max-w-4xl gap-4">
                  {tour?.data?.tour?.imageTour.map((src: string, index: number) => (
                      <img
                          key={index}
                          src={src}
                          className="thumb rounded-lg md:h-24 h-14 object-cover cursor-pointer hover:opacity-80"
                          alt={`Thumb ${index + 1}`}
                          onClick={() => handleThumbnailClick(src)}
                      />
                  ))}
              </div>
          </div>
      </div>

    )
}

export default LeftTourDetail
