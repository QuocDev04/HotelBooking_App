import type { Tour } from "../type"
import TourItem from "./TourItem"


type Props = {
    tours: Tour[]
}
const TourList = ({ tours }: Props) => {
    if (!tours || tours.length === 0) return <div>Không có tour nào.</div>;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour: Tour) => (
                    <TourItem key={tour._id} tour={tour} />
                ))}
            </div>

        </>
    );
};
export default TourList