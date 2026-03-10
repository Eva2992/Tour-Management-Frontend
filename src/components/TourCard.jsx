const TourCard = ({ tour }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white w-80">
      <img
        src={`http://localhost:3000/img/tours/${tour.imageCover}`}
        alt={tour.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-800">{tour.name}</h3>
        <p className="text-gray-500 text-sm">{tour.summary}</p>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>⏱ {tour.duration} days</span>
          <span>👥 {tour.maxGroupSize} people</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>⭐ {tour.ratingsAverage} ({tour.ratingsQuantity})</span>
          <span className="font-semibold text-green-600">From ${tour.price}</span>
        </div>
        <button className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors cursor-pointer">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TourCard;