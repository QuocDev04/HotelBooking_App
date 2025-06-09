export interface Tour {
    tour_id: number;
    tour_name: string;
    imageTour: string;
    destination: string;
    promotion_price?: number;
    price: number;
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