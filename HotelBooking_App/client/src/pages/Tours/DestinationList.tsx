import { useQuery } from "@tanstack/react-query";
import { Input, Select, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from "react";
import instanceClient from "../../../configs/instance";
import TourList from "../../components/TourList";
import type { Tour } from "../../type";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DestinationList = () => {
  const {data} = useQuery({
    queryKey:['tour'],
    queryFn: async () => instanceClient.get("/tour")
  })
  const tours: Tour[] = data?.data?.tours || [];
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<any>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [filtered, setFiltered] = useState<Tour[]>(tours);

  // Lấy danh sách địa điểm từ dữ liệu API, loại bỏ trùng lặp
  const locations = Array.from(new Set(tours.map(t => t.departure_location).filter(Boolean)));

  const handleSearch = () => {
    setFiltered(
      tours.filter((tour: Tour) => {
        const matchName = searchText ? tour.nameTour?.toLowerCase().includes(searchText.toLowerCase()) : true;
        const matchLocation = location ? tour.departure_location?.toLowerCase().includes(location.toLowerCase()) : true;
        let matchDate = true;
        if (dates && dates.length === 2) {
          const dep = tour.departure_date ? tour.departure_date : '';
          const ret = tour.return_date ? tour.return_date : '';
          matchDate = dep >= dates[0].format('YYYY-MM-DD') && ret <= dates[1].format('YYYY-MM-DD');
        }
        const matchMinPrice = minPrice ? (tour.price !== undefined ? tour.price >= minPrice : false) : true;
        const matchMaxPrice = maxPrice ? (tour.price !== undefined ? tour.price <= maxPrice : false) : true;
        return matchName && matchLocation && matchDate && matchMinPrice && matchMaxPrice;
      })
    );
  };


  return (
    <main className="flex flex-col gap-6 px-4 md:px-8 py-6 max-w-screen-2xl mx-auto mt-8">
      <section className="flex-1">
        <div style={{
          background: 'linear-gradient(90deg, #e0eaff 0%, #fbeaff 100%)',
          borderRadius: 24,
          padding: 24,
          marginBottom: 32,
          boxShadow: '0 4px 24px rgba(80,120,200,0.08)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(80,120,200,0.06)',
            padding: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 18,
            justifyContent: 'center',
            minHeight: 80
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <Input
                placeholder="Tìm kiếm tour..."
                allowClear
                size="large"
                prefix={<SearchOutlined style={{color:'#b0b0b0'}} />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{
                  borderRadius: '12px 0 0 12px',
                  border: '1px solid #e0e0e0',
                  width: 240,
                  background: '#f7faff',
                  fontSize: 16,
                  borderRight: 'none',
                  height: 48
                }}
                onPressEnter={handleSearch}
              />
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{
                  borderRadius: '0 12px 12px 0',
                  height: 48,
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '0 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px #b3c6ff33'
                }}
              >
                Tìm kiếm
              </Button>
            </div>
            <Select
              placeholder="Địa điểm"
              style={{
                borderRadius: 12,
                width: 170,
                background: '#f7faff',
                fontSize: 16
              }}
              size="large"
              allowClear
              value={location || undefined}
              onChange={value => setLocation(value as string)}
              styles={{ popup: { root: { borderRadius: 12 } } }}
            >
              {locations.map(loc => (
                <Option key={loc} value={loc}>{loc}</Option>
              ))}
            </Select>
            <RangePicker
              style={{
                borderRadius: 12,
                width: 260,
                background: '#f7faff',
                fontSize: 16
              }}
              size="large"
              placeholder={["Ngày đi", "Ngày về"]}
              onChange={val => setDates(val)}
              format="YYYY-MM-DD"
            />
            <Input
              type="number"
              placeholder="Giá từ (VNĐ)"
              size="large"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              style={{
                borderRadius: 12,
                width: 140,
                background: '#f7faff',
                fontSize: 16
              }}
              min={0}
            />
            <Input
              type="number"
              placeholder="Giá đến (VNĐ)"
              size="large"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              style={{
                borderRadius: 12,
                width: 140,
                background: '#f7faff',
                fontSize: 16
              }}
              min={0}
            />
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
