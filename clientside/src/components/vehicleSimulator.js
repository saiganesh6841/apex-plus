import React, { useEffect, useState } from 'react';
import './VehicleSimulator.css';

const GRID_WIDTH = 800;
const GRID_HEIGHT = 500;

const vehicleColors = [
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta'
];

const VehicleSimulator = ({ vehicles, simulationRunning }) => {
  const [vehiclePositions, setVehiclePositions] = useState({});

  useEffect(() => {
    // Initialize vehicle positions
    const initialPositions = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.id] = { x: vehicle.positionX, y: vehicle.positionY, hidden: false };
      return acc;
    }, {});
    setVehiclePositions(initialPositions);
  }, [vehicles]);

  useEffect(() => {
    if (simulationRunning) {
      const interval = setInterval(() => {
        setVehiclePositions((prevPositions) => {
          const newPositions = { ...prevPositions };

          vehicles.forEach((vehicle, index) => {
            const pos = newPositions[vehicle.id];
            if (pos.hidden) return;

            switch (vehicle.direction) {
              case 'Towards':
                pos.x += vehicle.speed;
                break;
              case 'Backwards':
                pos.x -= vehicle.speed;
                break;
              case 'Upwards':
                pos.y -= vehicle.speed;
                break;
              case 'Downwards':
                pos.y += vehicle.speed;
                break;
              default:
                break;
            }

            if (pos.x > GRID_WIDTH || pos.y > GRID_HEIGHT || pos.x < 0 || pos.y < 0) {
              pos.hidden = true;
            }
          });

          return newPositions;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [simulationRunning, vehicles]);

  return (
    <div className="vehicle-simulator">
      {Object.keys(vehiclePositions).map((vehicleId, index) => {
        const pos = vehiclePositions[vehicleId];
        return (
          pos && !pos.hidden && (
            <div
              key={vehicleId}
              className="vehicle"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                backgroundColor: vehicleColors[index % vehicleColors.length]
              }}
            >
              {index + 1}
            </div>
          )
        );
      })}
    </div>
  );
};

export default VehicleSimulator;
