/* eslint-disable @typescript-eslint/no-explicit-any */
import { FireOutlined } from "@ant-design/icons"
import { Card, Col, Space, Typography } from "antd"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const Popular = () => {
    const { Text } = Typography;
    const serviceDistributionData = [
        { name: 'tour Deluxe', value: 35, color: '#1890ff' },
        { name: 'tour Suite', value: 25, color: '#52c41a' },
        { name: 'tour Standard', value: 20, color: '#faad14' },
        { name: 'Tour Đà Nẵng', value: 12, color: '#722ed1' },
        { name: 'Tour Hội An', value: 8, color: '#eb2f96' },
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
                              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                              <FireOutlined style={{ fontSize: 20, color: 'white' }} />
                          </div>
                          <Text strong style={{ fontSize: 18 }}>🎯 Top 5 Tour Đặt Nhiều Nhất</Text>
                      </Space>
                  }
              >
                  <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                          <Pie
                              data={serviceDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="#fff"
                              strokeWidth={2}
                          >
                              {serviceDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                          <Tooltip
                              formatter={(value: any) => [`${value}%`, 'Tỷ lệ']}
                              contentStyle={{
                                  borderRadius: 8,
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)'
                              }}
                          />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
              </Card>
          </Col>
    </>
  )
}

export default Popular