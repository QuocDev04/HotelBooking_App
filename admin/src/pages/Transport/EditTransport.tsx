/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, message, Row, Select, type FormProps } from "antd"
import instance from "../../configs/axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const EditTransport = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const {id} = useParams();
    const requiredLabel = (text: string) => (
        <>
            {text} <span className="text-red-500">*</span>
        </>
    );
    const {data} = useQuery({
        queryKey:['transport',id],
        queryFn: async () => instance.get(`/transport/${id}`)
    })
    console.log(data?.data?.transport);
    useEffect(() => {
        if (data?.data?.transport) {
            form.setFieldsValue({
                ...data.data.transport
            });
        }
    }, [data, form]);
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            try {
                return await instance.put(`/transport/${id}`, data)
            } catch (error) {
                throw new Error("Failed to add transport")
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Bạn Sửa phương tiện thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["transport"],
            });
        },
        onError: () => {
            messageApi.open({
                type: "error",
                content: "Bạn Sửa phương tiện thất bại. Vui lòng thử lại sau!",
            });
        },
    })
    const onFinish: FormProps<any>["onFinish"] = (values) => {
        const newValues = {
            ...values,
        };
        mutate(newValues);
    };
    return (
        <>
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-blue-600">➕ Sửa Phương Tiện</h1>
                    </div>
                    {contextHolder}
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <Form layout="vertical"
                            onFinish={onFinish}
                            validateTrigger="onBlur"
                            form={form}
                            initialValues={{...data?.data?.transport}}
                            >
                            {/* Cột trái */}
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel("Tên Phương Tiện")}
                                        name="transportName"
                                        rules={[{ required: true, message: "Tên Phương Tiện không được để trống" }]}
                                    >
                                        <Input disabled={isPending} placeholder="VD: Phương Tiện Hạ Long 3N2Đ" size="large" />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel("Biển Số Phương Tiện")}
                                        name="transportNumber"
                                        rules={[
                                            { required: true, message: "Nhập Biển Số Phương Tiện" },
                                            { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                                        ]}
                                    >
                                        <Input disabled={isPending} placeholder="VD: 29B-12345" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel("Loại Phương Tiện")}
                                        name="transportType"
                                        rules={[{ required: true, message: "Vui lòng chọn loại Phương Tiện" }]}
                                    >
                                        <Select
                                            disabled={isPending}
                                            size="large"
                                            placeholder="Chọn loại Phương Tiện"
                                            options={[
                                                { label: "Máy Bay", value: "Máy Bay" },
                                                { label: "Tàu Hỏa", value: "Tàu Hỏa" },
                                                { label: "Thuyền", value: "Thuyền" },
                                                { label: "Xe Khách", value: "Xe Khách" },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel("Nơi Đón Khách")}
                                        name="departureLocation"
                                        rules={[
                                            { required: true, message: "Nhập Nơi Đón Khách" },
                                            { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                                        ]}
                                    >
                                        <Input disabled={isPending} placeholder="VD: 29B-12345" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel("Nơi Trả Khách")}
                                        name="arrivalLocation"
                                        rules={[
                                            { required: true, message: "Nhập Nơi Trả Khách" },
                                            { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                                        ]}
                                    >
                                        <Input disabled={isPending} placeholder="VD: 29B-12345" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Form.Item>
                                    <Button
                                        disabled={isPending}
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 mt-10"
                                    >
                                        ✅ Xác Nhận Sửa Phuơng Tiện
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditTransport
