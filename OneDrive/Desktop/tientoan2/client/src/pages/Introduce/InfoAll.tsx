import  { useState } from "react";
import Introduce from "./Introduce";
import Clause from "./Clause";
import Privacy from "./Privacy";
import Use from "./Use";

const sections = [
  { title: "Giới thiệu", component: <Introduce /> },
  { title: "Điều khoản & Điều kiện", component: <Clause /> },
  { title: "Chính sách quyền riêng tư", component: <Privacy /> },
  { title: "Hướng dẫn sử dụng", component: <Use /> },
];

const InfoAll = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold  my-20 text-center">Thông tin chung</h1>
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div key={idx} className="border rounded-lg bg-white shadow">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-lg flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{sec.title}</span>
              <span>{openIndex === idx ? "▲" : "▼"}</span>
            </button>
            {openIndex === idx && (
              <div className="px-2 pb-4">
                {sec.component}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoAll;