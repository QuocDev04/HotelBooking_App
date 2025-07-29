/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Space, Typography } from "antd";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const NewCustomersData = () => {
    const { Text } = Typography;

    const newCustomersData = [
        { month: 'T1', customers: 45, returning: 120 },
        { month: 'T2', customers: 52, returning: 135 },
        { month: 'T3', customers: 68, returning: 158 },
        { month: 'T4', customers: 58, returning: 142 },
        { month: 'T5', customers: 75, returning: 168 },
        { month: 'T6', customers: 82, returning: 185 },
        { month: 'T7', customers: 95, returning: 210 },
        { month: 'T8', customers: 108, returning: 235 },
        { month: 'T9', customers: 125, returning: 268 },
        { month: 'T10', customers: 142, returning: 295 },
        { month: 'T11', customers: 158, returning: 320 },
        { month: 'T12', customers: 175, returning: 350 },
    ];
    
  return (
    <>
          <Col xs={24} lg={12}>
              <Card
                  style={{
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)'
                  }}
                  title={
                      <Space>
                          <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                              <UserOutlined style={{ fontSize: 20, color: 'white' }} />
                          </div>
                          <Text strong style={{ fontSize: 18 }}>👥 Khách hàng mới vs Khách hàng cũ</Text>
                      </Space>
                  }
              >
                  <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={newCustomersData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                              dataKey="month"
                              tick={{ fill: '#666', fontSize: 12 }}
                              axisLine={{ stroke: '#d9d9d9' }}
                          />
                          <YAxis
                              tick={{ fill: '#666', fontSize: 12 }}
                              axisLine={{ stroke: '#d9d9d9' }}
                          />
                          <Tooltip
                              formatter={(value: any, name: any) => [
                                  `${value} khách hàng`,
                                  name === 'customers' ? 'Khách hàng mới' : 'Khách hàng cũ'
                              ]}
                              contentStyle={{
                                  borderRadius: 8,
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)'
                              }}
                          />
                          <Legend />
                          <Area
                              type="monotone"
                              dataKey="customers"
                              stackId="1"
                              stroke="url(#areaGradient1)"
                              fill="url(#areaGradient1)"
                              fillOpacity={0.8}
                          />
                          <Area
                              type="monotone"
                              dataKey="returning"
                              stackId="1"
                              stroke="url(#areaGradient2)"
                              fill="url(#areaGradient2)"
                              fillOpacity={0.8}
                          />
                          <defs>
                              <linearGradient id="areaGradient1" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
                              </linearGradient>
                              <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#43e97b" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#38f9d7" stopOpacity={0.8} />
                              </linearGradient>
                          </defs>
                      </AreaChart>
                  </ResponsiveContainer>
              </Card>
          </Col>
    </>
  )
}

export default NewCustomersData