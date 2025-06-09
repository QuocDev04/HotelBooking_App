import React from "react";

export const HotelPolicy = () => {
  const policies = [
    {
      title: "Thời gian nhận phòng",
      content:
        "Giờ nhận phòng từ 12h45-13h00... khách hàng nên có mặt tại điểm đón trước 12h để chuẩn bị..."
    },
    {
      title: "Thời gian trả phòng",
      content:
        "Giờ trả phòng từ 9h30-10h00 vào buổi sáng hôm sau..."
    },
    {
      title: "Quy định nhận phòng",
      content:
        "Quý khách cần mang theo Giấy tờ tùy thân (CMND/CCCD hoặc Hộ chiếu còn hiệu lực)..."
    },
    {
      title: "Giá phòng đã bao gồm",
      content:
        "Hướng dẫn viên, các bữa ăn, vé thắng cảnh, chèo thuyền kayak..."
    },
    {
      title: "Giá phòng không bao gồm",
      content:
        "Xe đưa đón, đồ uống cá nhân, dịch vụ giặt là, chi phí khác không được liệt kê..."
    },
    {
      title: "Trẻ em, giường phụ và phụ thu cuối tuần",
      content:
        "Mỗi phòng tối đa 2 người lớn và 1 trẻ em... có phụ thu cuối tuần..."
    },
    {
      title: "Hủy đặt phòng",
      content:
        "Hủy trước 07 ngày được hoàn tiền, sau 07 ngày mất phí..."
    },
    {
      title: "Hoàn huỷ do điều kiện thời tiết",
      content:
        "Trong trường hợp bất khả kháng như thời tiết xấu, chuyến đi sẽ bị hoãn và hoàn lại tiền..."
    }
  ];

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Quy định chung và lưu ý</h1>
      {policies.map((item, index) => (
        <div key={index} className="p-4 mb-4 bg-white border rounded-lg shadow">
          <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{item.content}</p>
        </div>
      ))}
    </div>
  );
};