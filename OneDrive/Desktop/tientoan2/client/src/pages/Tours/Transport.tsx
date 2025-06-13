import { useState } from "react";

const Transport = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [directOnly, setDirectOnly] = useState(false);
  const [from, setFrom] = useState("HAN Sân bay Quốc tế Nội Bài");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [showError, setShowError] = useState(false);
  const [tab, setTab] = useState("transport");

  const handleSearch = () => {
    if (!to) {
      setShowError(true);
      return;
    }
    setShowError(false);
    alert("Đang tìm chuyến...");
  };

  const transportData = {
    transport: [
      {
        from: "Hà Nội",
        to: "Bangkok",
        image: "https://source.unsplash.com/400x250/?bangkok",
        date: "19 tháng 6 - 21 tháng 6",
      },
      {
        from: "Hà Nội",
        to: "Kuta",
        image: "https://source.unsplash.com/400x250/?bali",
        date: "13 tháng 6 - 27 tháng 6",
      },
      {
        from: "Hà Nội",
        to: "Tokyo",
        image: "https://source.unsplash.com/400x250/?tokyo",
        date: "19 tháng 6 - 16 tháng 7",
      },
      {
        from: "Hà Nội",
        to: "Chiang Mai",
        image: "https://source.unsplash.com/400x250/?chiangmai",
        date: "16 tháng 6 - 22 tháng 6",
      },
    ],
    domestic: [
      {
        from: "TP.HCM",
        to: "Đà Nẵng",
        image: "https://source.unsplash.com/400x250/?danang",
        date: "20 tháng 6 - 24 tháng 6",
      },
      {
        from: "Hà Nội",
        to: "Phú Quốc",
        image: "https://source.unsplash.com/400x250/?phuquoc",
        date: "25 tháng 6 - 30 tháng 6",
      },
    ],
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen pt-4 pb-20 px-4 md:px-8 lg:px-32">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#006CAA]">Tìm kiếm phương tiện</h1>
          <p className="text-gray-500 mt-2">So sánh và đặt chuyến đi theo lịch trình của bạn</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center text-sm mb-6">
          {["roundtrip", "oneway", "multi"].map((type) => (
            <label key={type} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value={type}
                checked={tripType === type}
                onChange={() => setTripType(type)}
                className="accent-blue-600"
              />
              {type === "roundtrip" ? "Khứ hồi" : type === "oneway" ? "Một chiều" : "Nhiều chặng"}
            </label>
          ))}
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={() => setDirectOnly(!directOnly)}
              className="accent-blue-600"
            />
            Chỉ chuyến bay thẳng
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nơi đi</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-blue-500"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="VD: HAN"
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Nơi đến</label>
            <input
              type="text"
              className={`w-full border px-4 py-2 rounded-lg ${showError ? "border-red-500" : "border-gray-300"} focus:outline-blue-500`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="VD: SGN"
            />
            {showError && (
              <span className="absolute text-xs text-red-600 mt-1">Nhập sân bay hoặc thành phố</span>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Ngày đi</label>
            <input
              type="date"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-blue-500"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {tripType === "roundtrip" && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Ngày về</label>
              <input
                type="date"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-blue-500"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Hành khách</label>
            <select
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-blue-500"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num}>{num} người lớn</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Tìm chuyến
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách chuyến bay phổ biến */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Chuyến bay phổ biến gần bạn</h2>
        <p className="text-gray-500">Tìm ưu đãi cho chuyến bay trong nước và quốc tế</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {transportData[tab]?.map((item, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow hover:shadow-md transition">
              <img src={item.image} alt={item.to} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  {item.from} đến {item.to}
                </h3>
                <p className="text-sm text-gray-500">{item.date} · Khứ hồi</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transport;
