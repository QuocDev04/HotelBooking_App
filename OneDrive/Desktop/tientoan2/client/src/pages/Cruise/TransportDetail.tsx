import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TransportDetail = () => {
  const { id } = useParams();
  const [transport, setTransport] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/transport/${id}`)
      .then((res) => res.json())
      .then((data) => setTransport(data))
      .catch((err) => console.error("Lỗi khi fetch transport:", err));
  }, [id]);

  if (!transport) {
    return <div className="text-center mt-20">Đang tải thông tin phương tiện...</div>;
  }

  return (
    <main className="font-sans text-gray-800 pt-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <img
            src="/transport-banner.jpg"
            alt={transport.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-emerald-700">{transport.name}</h1>
            <p className="text-gray-500 text-sm mt-1 italic">Loại phương tiện: {transport.transport_type}</p>

            <div className="mt-4 space-y-2">
              <p><strong>Mã chuyến:</strong> {transport.number}</p>
              <p><strong>Khởi hành:</strong> {transport.departure_location}</p>
              <p><strong>Điểm đến:</strong> {transport.arrival_location}</p>
            </div>

            <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full transition">
              Đặt vé ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransportDetail;
