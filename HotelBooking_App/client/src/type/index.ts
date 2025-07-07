export interface Tour {
    _id: number;
    nameTour: string;
    destination: string;
    departure_location: string;
    duration: number;
    price: number;
    finalPrice: number;
    discountPercent: number;
    discount_expiry_date: string;
    remainingSlots: number;
    max_people: number;
    imageTour: string;
    status: string;
    description: string;
    tour_type: string;
    featured: boolean;
    total_sold: number;
}

export interface Room {
    room_id: number;
    room_name: string;
    hotel_id: number;
    price: number;
    amenities: string[];
}

export interface Review {
    review_id: number;
    user_id: number;
    room_id: number;
    rating: number;
    comment: string;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone: string;
}

export interface Hotel {
    hotel_id: number;
    name: string;
    address: string;
    rating: number;
    image: string;
}