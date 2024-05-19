import edit from "../logos/edd.png";
import del from "../logos/delete.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./homepage.css";
import { baseURL } from "../App";
import { Bubble } from "react-chartjs-2";
import { Chart, LinearScale, PointElement, Tooltip, Legend, BubbleController } from "chart.js";

// Register required components
Chart.register(LinearScale, PointElement, Tooltip, Legend,BubbleController);

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [scenarioOptions, setScenarioOptions] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [sceneId, setSceneId] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get(`${baseURL}/api/data`)
      .then(response => {
        const scenariosData = response.data;
        setScenarios(scenariosData);
        const scenarios = scenariosData.map(item => item.scenarioName);
        setScenarioOptions(scenarios);
        if (scenarios.length > 0) {
          setSelectedScenario(scenarios[0]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching scenario data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const matchedScenario = scenarios.find(scenario => scenario.scenarioName === selectedScenario);
    setSceneId(matchedScenario?.id);
  }, [selectedScenario, scenarios]);

  useEffect(() => {
    if (selectedScenario) {
      const selectedScenarioObject = scenarios.find(scenario => scenario.scenarioName === selectedScenario);
      if (selectedScenarioObject) {
        setVehicles(selectedScenarioObject.vehicles || []);
      }
    } else {
      setVehicles([]);
    }
  }, [selectedScenario, scenarios]);

  const handleEdit = (vehicle) => {
    const selectedScenarioObject = scenarios.find(scenario => scenario.scenarioName === selectedScenario);
    if (selectedScenarioObject) {
      navigate("/vehicle", { state: { vehicle, selectedScenario: selectedScenarioObject.scenarioName } });
    } else {
      console.error("Selected scenario not found.");
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      const response = await axios.get(`${baseURL}/api/data/${sceneId}`);
      const selectedScenarioData = response.data;
      selectedScenarioData.vehicles = selectedScenarioData.vehicles.filter(vehicle => vehicle.id !== vehicleId);
      const result = await axios.put(`${baseURL}/api/data/${sceneId}`, selectedScenarioData);
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      console.log('Vehicle deleted successfully:', result.data);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  useEffect(() => {
    if (simulationRunning) {
      const simulationInterval = setInterval(() => {
        const updatedVehicles = vehicles.map(vehicle => {
          const speed = parseInt(vehicle.speed, 10);
          let newPositionX = parseInt(vehicle.positionX, 10);
          let newPositionY = parseInt(vehicle.positionY, 10);
          switch (vehicle.direction) {
            case "Forward":
              newPositionX += speed;
              break;
            case "Backward":
              newPositionX -= speed;
              break;
            case "Upward":
              newPositionY -= speed;
              break;
            case "Downward":
              newPositionY += speed;
              break;
            default:
              break;
          }
          if (newPositionX < 0 || newPositionX > 800 || newPositionY < 0 || newPositionY > 500) {
            newPositionX = -100;
            newPositionY = -100;
          }
          return {
            ...vehicle,
            positionX: newPositionX,
            positionY: newPositionY
          };
        });
        setVehicles(updatedVehicles);
      }, 1000);
      return () => clearInterval(simulationInterval);
    }
  }, [simulationRunning, vehicles]);

  const data = {
    datasets: [
      {
        label: "Vehicles",
        data: vehicles.map(vehicle => ({
          x: vehicle.positionX,
          y: vehicle.positionY,
          r: 10
        })),
        backgroundColor: vehicles.map((_, index) => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: 800
      },
      y: {
        min: 0,
        max: 800
      }
    }
  };

  useEffect(() => {
    const ctx = document.getElementById("vehicleChart").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bubble",
      data: data,
      options: options
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [vehicles, simulationRunning]);

  const handleStartSimulation = () => {
    setSimulationRunning(true);
  };

  const handleStopSimulation = () => {
    setSimulationRunning(false);
  };

  return (
    <>
   
    
      <div className="homepage">
        <label>
          Scenario List:
          <select
            value={selectedScenario}
            onChange={e => setSelectedScenario(e.target.value)}
          >
            <option value="" disabled>Select a scenario</option>
            {scenarioOptions.map((scenario, index) => (
              <option key={index} value={scenario}>{scenario}</option>
            ))}
          </select>
        </label>
        <table className="scenarioTable">
          <thead>
            <tr>
              <th>Vehicle Id</th>
              <th>Vehicle Name</th>
              <th>Position X</th>
              <th>Position Y</th>
              <th>Speed</th>
              <th>Direction</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.id.slice(0, 4)}</td>
                <td>{vehicle.vehicleName}</td>
                <td>{vehicle.positionX}</td>
                <td>{vehicle.positionY}</td>
                <td>{vehicle.speed}</td>
                <td>{vehicle.direction}</td>
                <td><img src={edit} alt="Edit" onClick={() => handleEdit(vehicle)} /></td>
                <td><img src={del} alt="Delete" onClick={() => handleDelete(vehicle.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btn-container">
          <button type="submit" style={{ backgroundColor: "green" }} onClick={handleStartSimulation}>Start Simulation</button>
          <button type="button" style={{ backgroundColor: "blue" }} onClick={handleStopSimulation}>Stop Simulation</button>
        </div>
        <div className="chart-container">
          <canvas id="vehicleChart"></canvas>
        </div>
      </div>
      
    </>
  );
};

export default HomePage;