
import React from 'react';

const steps = [
  'Volunteer Assigned',
  'Pickup Started',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
];

const getProgress = (status) => {
  const index = steps.indexOf(status);

  if (index === -1) return 0;

  return (index / (steps.length - 1)) * 100;
};

const DeliveryTracker = ({ donation }) => {
  const status = donation?.status || 'Volunteer Assigned';

  const progress = getProgress(status);

  const isRejected =
    status === 'Rejected' || status === 'Cancelled';

  if (isRejected) {
    return (
      <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">
        ❌ Donation {status.toLowerCase()}
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 rounded-2xl border bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800">
          🛵 Delivery Tracking
        </h4>

        <span className="text-xs font-semibold text-teal-600">
          {status}
        </span>
      </div>

      {/* Route */}
      <div className="relative px-2">

        <div className="flex justify-between items-center text-xl">
          <span>📍</span>
          <span>🏢</span>
        </div>

        {/* Track line */}
        <div className="relative h-3 rounded-full bg-gray-200 mt-3">

          <div
            className="absolute left-0 top-0 h-3 rounded-full"
            style={{
              width: `${progress}%`,
              background: '#2EC4B6',
              transition: 'width 1s ease-in-out',
            }}
          />

          {/* Moving bike */}
          <div
            className="absolute -top-7 text-2xl"
            style={{
              left: `${progress}%`,
              transform: 'translateX(-50%)',
              transition: 'left 1s ease-in-out',
            }}
          >
            🛵
          </div>

        </div>

        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>Donor</span>
          <span>NGO / Destination</span>
        </div>
      </div>

      {/* Status steps */}
      <div className="mt-5 space-y-2">
        {steps.map((step, index) => {
          const currentIndex = steps.indexOf(status);
          const completed = index <= currentIndex;

          return (
            <div
              key={step}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={
                  completed
                    ? 'text-teal-600 font-bold'
                    : 'text-gray-400'
                }
              >
                {completed ? '✓' : '○'}
              </span>

              <span
                className={
                  completed
                    ? 'text-gray-800 font-semibold'
                    : 'text-gray-400'
                }
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {status === 'Delivered' && (
        <div className="mt-4 p-3 rounded-xl bg-green-100 text-green-700 text-sm font-semibold">
          ✅ Delivery completed successfully!
        </div>
      )}

    </div>
  );
};

export default DeliveryTracker;
