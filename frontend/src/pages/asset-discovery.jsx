import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';

const AssetFinder = () => {
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("");
  const [capacityMin, setCapacityMin] = useState(0);
  const [capacityMax, setCapacityMax] = useState(100);
  const [date, setDate] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [assets, setAssets] = useState([]);
  const [amenityOptions, setAmenityOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [bookingTime, setBookingTime] = useState({ startTime: "", endTime: "" });
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const assetResponse = await axios.get("http://localhost:3000/assets");
        const amenitiesResponse = await axios.get("http://localhost:3000/amenities");

        setAssets(assetResponse.data);
        setLocationOptions([...new Set(assetResponse.data.map(a => a.location))]);
        setAmenityOptions(amenitiesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAmenityToggle = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBookingClick = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const submitBooking = async () => {
    if (!selectedAsset) return;

    try {
      await axios.post("http://localhost:3000/bookings", {
        asset_id: selectedAsset.id,
        start_time: bookingTime.startTime,
        end_time: bookingTime.endTime,
      });

      setBookingStatus("success");

      setTimeout(() => {
        setShowModal(false);
        setBookingStatus(null);
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingStatus("error");
    }
  };

  const filteredAssets = assets.filter(asset => {
    const locationMatch = !location || asset.location === location;
    const typeMatch = !assetType || asset.type === assetType;
    const capacityMatch = asset.capacity >= capacityMin && asset.capacity <= capacityMax;
    const amenitiesMatch = selectedAmenities.every(id =>
      asset.amenities?.some(am => am.id === id)
    );
    return locationMatch && typeMatch && capacityMatch && amenitiesMatch;
  });

  const assetTypes = ["classroom", "lab", "hostel", "faculty", "hall"];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading assets...</div>;
  }

  if (error) {
    return <div className="text-red-500 flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 pt-20">
      {/* Filters Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Filter Assets</h2>

        {/* Location Filter */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Location</label>
          <select
            className="w-full p-2 border rounded"
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locationOptions.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Asset Type</label>
          <select
            className="w-full p-2 border rounded"
            value={assetType}
            onChange={e => setAssetType(e.target.value)}
          >
            <option value="">All Types</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Capacity Filter */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Capacity</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              placeholder="Min"
              value={capacityMin}
              onChange={e => setCapacityMin(Number(e.target.value))}
            />
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              placeholder="Max"
              value={capacityMax}
              onChange={e => setCapacityMax(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Date (optional) */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* Amenities Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map(am => (
              <Button
                key={am.id}
                variant={selectedAmenities.includes(am.id) ? "contained" : "outlined"}
                color="primary"
                size="small"
                onClick={() => handleAmenityToggle(am.id)}
                sx={{ borderRadius: '16px', margin: '2px', textTransform: 'none' }}
              >
                {am.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-6">Available Assets</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.length > 0 ? (
            filteredAssets.map(asset => (
              <div key={asset.id} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-bold mb-1">
                  {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} - {asset.location}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  Capacity: {asset.capacity} |{" "}
                  <span className={asset.available ? "text-green-600" : "text-red-600"}>
                    {asset.available ? "Available" : "Unavailable"}
                  </span>
                </p>
                <div className="mb-3">
                  <span className="text-sm font-medium">Amenities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {asset.amenities?.map(am => (
                      <span key={am.id} className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {am.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={!asset.available}
                    onClick={() => handleBookingClick(asset)}
                  >
                    Book
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">No assets match the filters.</div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {bookingStatus === "success" ? (
              <div className="text-center text-green-600">
                <h2 className="text-xl font-bold mb-2">Booking Request Sent!</h2>
                <p>The admin will review your request shortly.</p>
              </div>
            ) : bookingStatus === "error" ? (
              <div className="text-center text-red-600">
                <h2 className="text-xl font-bold mb-2">Booking Failed</h2>
                <p>Please try again later.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Book {selectedAsset.name}</h2>
                <label className="block mb-1 text-sm font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full mb-4 p-2 border rounded"
                  value={bookingTime.startTime}
                  onChange={e => setBookingTime({ ...bookingTime, startTime: e.target.value })}
                />
                <label className="block mb-1 text-sm font-medium">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full mb-4 p-2 border rounded"
                  value={bookingTime.endTime}
                  onChange={e => setBookingTime({ ...bookingTime, endTime: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitBooking}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetFinder;