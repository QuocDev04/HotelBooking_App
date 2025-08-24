import type { Tour } from "../type"
import TourItem from "./TourItem"


type Props = {
    tours: Tour[]
}
const TourList = ({ tours }: Props) => {
    if (!tours || tours.length === 0) return <div>Không có tour nào.</div>;

    return (
        <>
<<<<<<< HEAD
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour: Tour) => (
                    <TourItem key={tour._id} tour={tour} />
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
                {tours.map((tour: Tour) => (
                    <div key={tour._id} className="flex">
                        <TourItem tour={tour} />
                    </div>
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                ))}
            </div>

        </>
    );
};
export default TourList