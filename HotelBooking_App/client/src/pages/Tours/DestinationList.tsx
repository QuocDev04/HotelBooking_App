import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import instanceClient from "../../../configs/instance";
import TourList from "../../components/TourList";

// Định nghĩa hoặc import DestinationType phù hợp với dữ liệu
interface DestinationType {
  nameTour: string;
  departure_location: string;
  // ... các trường khác nếu có ...
}

const DestinationList = () => {
  const {data} = useQuery({
    queryKey:['tour'],
    queryFn: async () => instanceClient.get("/tour")
  })
  console.log(data?.data?.tours);
  const tours = data?.data?.tours
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = tours?.filter(
    (d: DestinationType) =>
      d.nameTour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.departure_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-col gap-6 px-4 md:px-8 py-6 max-w-screen-2xl mx-auto mt-20">
      <section className="flex-1">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-center mb-2">Bạn lựa chọn địa điểm du lịch nào?</h2>
          <p className="text-center text-gray-500 mb-4">Hơn 100 điểm đến hấp dẫn đang chờ bạn khám phá</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="🔍 Nhập tên địa điểm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full px-5 py-2 w-full md:w-96 focus:outline-none"
            />
            <button className="bg-teal-500 text-white font-medium rounded-full px-6 py-2 hover:bg-teal-600 transition">
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="">
          <TourList tours={filtered} />
        </div>
      </section>
    </main>
  );
};

export default DestinationList;
