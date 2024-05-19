import { useEffect, useState } from "react";
import "./vehicle.css"
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { baseURL } from "../App";





const VehiclePage = () => {

    const [selectedScenario, setSelectedScenario] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [positionX, setPositionX] = useState('');
    const [positionY, setPositionY] = useState('');
    const [speed, setSpeed] = useState('');
    const [direction, setDirection] = useState('Towards');
    const [scenarioOptions, setScenarioOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [scenarios, setScenarios] = useState([]);
    const [sceneId, setSceneId] = useState(null)
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        // Fetch the scenario data from the API
        axios.get(`${baseURL}/api/data`)
            .then(response => {
                const scenariosData = response.data;
                setScenarios(scenariosData)
                const scenarios = scenariosData.map(item => item.scenarioName);
                setScenarioOptions(scenarios);
                // Set the selected scenario if it was passed via state
                if (location.state?.scenarioName) {
                    setSelectedScenario(location.state.scenarioName);
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
        if (location.state?.vehicle && location.state?.selectedScenario) {
            const { vehicle, selectedScenario } = location.state;
            setVehicleName(vehicle.vehicleName);
            setPositionX(vehicle.positionX);
            setPositionY(vehicle.positionY);
            setSpeed(vehicle.speed);
            setDirection(vehicle.direction);
            setSelectedScenario(selectedScenario);
        }

    }, [location.state]);


    const validatePositions = () => {
        const newErrors = {};
        if (!vehicleName) {
            newErrors.vehicleName = 'Vehicle Name is required';
        }
        if (positionX < 0 || positionX > 800) {
            newErrors.positionX = 'Position X should not be > 800 and < 0';
        }
        if (positionY < 0 || positionY > 800) {
            newErrors.positionY = 'Position Y should not be > 800 and < 0';
        }
        if (!speed) {
            newErrors.speed = 'Speed is required';
        } else if (isNaN(speed) || speed <= 0) {
            newErrors.speed = 'Speed must be a positive number';
        }
        return newErrors;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedScenario) {
            setErrors({ selectedScenario: 'Please select a scenario' });
            return;
        }

        // Handle the form submission logic
        const validationErrors = validatePositions();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Handle the form submission logic
            const vehicle = {
                id: uuidv4(),
                vehicleName,
                positionX,
                positionY,
                speed,
                direction,
            };
            console.log(vehicle)
            try {
                const response = await axios.get(`${baseURL}/api/data/${sceneId}`);
                const selectedScenarioData = response.data;

                // Append the new vehicle to the existing vehicles list
                selectedScenarioData.vehicles.push(vehicle);
                const result = await axios.put(`${baseURL}/api/data/${sceneId}`, selectedScenarioData);
                console.log('Scenario updated successfully:', result.data);
                navigate("/")
                // Optionally, you can navigate to another page or reset the form here
            } catch (error) {
                console.error('Error updating scenario:', error);
            }


        }

    };

    const handleReset = () => {
        // alert(direction)
        setVehicleName("")
        setPositionX("")
        setPositionY("")
        setSpeed("")
        setSelectedScenario("")
        setErrors({});
    };

    const handleGoBack = () => {
        navigate(-1)
    };
    return (
        <>
            <div className="vehicle-page">
                <h1 className="vehicleAdd">Vehicle Page</h1>
                <form onSubmit={handleSubmit} >
                    <div className="display-row">
                        <div className="form-row">
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
                                {errors.selectedScenario && <span className="error">{errors.selectedScenario}</span>}
                            </label>
                            <label>
                                Vehicle Name:
                                <input type="text" value={vehicleName} placeholder="Target ABC" onChange={(e) => setVehicleName(e.target.value)} />
                                {errors.vehicleName && <span className="error">{errors.vehicleName}</span>}

                            </label>
                            <label>
                                Speed:
                                <input type="text" value={speed} placeholder="20" onChange={(e) => setSpeed(e.target.value)} />
                                {errors.speed && <span className="error">{errors.speed}</span>}
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                Initial Position X:
                                <input type="number" value={positionX} onChange={(e) => setPositionX(e.target.value)} />
                                {errors.positionX && <span className="error">{errors.positionX}</span>}
                            </label>
                            <label>
                                Initial Position Y:
                                <input type="number" value={positionY} onChange={(e) => setPositionY(e.target.value)} />
                                {errors.positionY && <span className="error">{errors.positionY}</span>}
                            </label>
                            <label>
                                Direction:
                                <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                                    <option value="Towards">Towards</option>
                                    <option value="Backwards">Backwards</option>
                                    <option value="Upwards">Upwards</option>
                                    <option value="Downwards">Downwards</option>
                                </select>
                            </label>

                        </div>
                        <br />
                    </div>
                    {/* <button className="buttonn" type="submit">Submit</button> */}
                    <div className="button-container">
                        <button type="submit" style={{ backgroundColor: "green" }}>ADD</button>
                        <button type="button" style={{ backgroundColor: "orange" }} onClick={handleReset}>Reset</button>
                        <button type="button" style={{ backgroundColor: "blue" }} onClick={handleGoBack}>Go Back</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default VehiclePage;