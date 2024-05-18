

import edit from "../logos/edd.png"
import del from "../logos/delete.png"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./homepage.css"

const HomePage = () => {

    const [vehicles, setVehicles] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [scenarioOptions, setScenarioOptions] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState('');
    const [sceneId, setSceneId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => {
                const scenariosData = response.data;
                setScenarios(scenariosData)
                const scenarios = scenariosData.map(item => item.scenarioName);
                setScenarioOptions(scenarios);
                //default take first one
                if (scenarios.length > 0) {
                    setSelectedScenario(scenarios[0]);
                }
            })
            .catch(error => {
                console.error('Error fetching scenario data:', error);
            });
    }, []);

    useEffect(() => {
        // console.log(selectedScenario)
        console.log(scenarios)
        const matchedScenario = scenarios.find((scenario) => { return scenario.scenarioName === selectedScenario })
        console.log(matchedScenario?.id)
        setSceneId(matchedScenario?.id)

    }, [selectedScenario, scenarios])

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
        // navigate("/vehicle", { state: { vehicle } });
        const selectedScenarioObject = scenarios.find(scenario => scenario.scenarioName === selectedScenario);
        if (selectedScenarioObject) {
            navigate("/vehicle", { state: { vehicle, selectedScenario: selectedScenarioObject.scenarioName } });
        } else {
            console.error("Selected scenario not found.");
        }
    };

    const handleDelete = async (vehicleId) => {
        try {
            // Fetch the scenario data
            const response = await axios.get(`http://localhost:5000/api/data/${sceneId}`);
            const selectedScenarioData = response.data;

            // Remove the vehicle with the specified vehicleId
            selectedScenarioData.vehicles = selectedScenarioData.vehicles.filter(vehicle => vehicle.id !== vehicleId);

            // Update the scenario data in the backend
            const result = await axios.put(`http://localhost:5000/api/data/${sceneId}`, selectedScenarioData);

            // Update the state to reflect the deletion
            setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));

            console.log('Vehicle deleted successfully:', result.data);
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    return (
        <>
            <div className="homepage">
                <label>
                    Scenario List:
                    <select
                        value={selectedScenario}
                        onChange={(e) => setSelectedScenario(e.target.value)}
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

                <div className="btn-COntainer">
                    <button type="submit" style={{ backgroundColor: "green" }}>Start Simulation</button>
                    <button type="button" style={{ backgroundColor: "blue" }} >Stop Simulation</button>
                </div>
            </div>
        </>
    )
}
export default HomePage