import type { Tour } from "../type"
import TourItem from "./TourItem"


type Props = {
    tours: Tour[]
}
const TourList = ({ tours }: Props) => {
    if (!tours || tours.length === 0) return <div>Không có tour nào.</div>;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
                {tours.map((tour: Tour) => (
                    <div key={tour._id} className="flex">
                        <TourItem tour={tour} />
                    </div>
                ))}
            </div>

        </>
    );
};
export default TourList