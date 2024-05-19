
import { useEffect, useState } from "react";
import "./allScenario.css"
import edit from "../logos/edd.png"
import add from "../logos/add.png"
import del from "../logos/delete.png"
import { useNavigate } from "react-router-dom";
import { baseURL } from "../App";

const AllScenarioPage = () => {

    const [scenarios, setScenarios] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${baseURL}/api/data`)
            .then(response => response.json())
            .then(data => {
                setScenarios(data);
            })
            .catch(error => {
                console.error('Error fetching scenario data:', error);
            });
    }, []);

    //to delete particular scenario
    const handleDelete = (id) => {
        fetch(`${baseURL}/api/data/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setScenarios(scenarios.filter(scenario => scenario.id !== id));
                } else {
                    console.error('Error deleting scenario:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error deleting scenario:', error);
            });
    };

    //to delete all scenarios
    const handleDeleteAll = () => {
        Promise.all(scenarios.map(scenario =>
            fetch(`${baseURL}/api/data/${scenario.id}`, {
                method: 'DELETE'
            })
        ))
            .then(responses => {
                if (responses.every(response => response.ok)) {
                    setScenarios([]);
                } else {
                    console.error('Error deleting all scenarios:', responses);
                }
            })
            .catch(error => {
                console.error('Error deleting all scenarios:', error);
            });
    };

    const handleNew = () => {
        navigate("/scenario")
    }

    const handleAddVehicle = () => {
        navigate("/vehicle")
    }
    const AddVehicle = (scenarioName) => {
        navigate("/vehicle", { state: { scenarioName } });
    };


    const handleEdit = (scenario) => {
        navigate("/scenario", { state: { scenario } });
    };

    return (
        <>
            <div className="scenario">
                <h1 className="scenarioNamee">All Scenarios</h1>
                <div className="bt">
                    <button style={{ backgroundColor: "blue" }} onClick={handleNew}>New Scenario</button>
                    <button style={{ backgroundColor: "green" }} onClick={handleAddVehicle}>Add Vehicle</button>
                    <button style={{ backgroundColor: "orange" }} onClick={handleDeleteAll}>Delete All</button>
                </div>
            </div>
            <div className="table">
                <table className="scenarioTable">
                    <thead>
                        <tr>
                            <th>Scenario Id</th>
                            <th>Scenario Name</th>
                            <th>Number of Vehicles</th>
                            <th>Add Vehicle</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.map(scenario => (
                            <tr key={scenario.id}>
                                <td>{scenario.id}</td>
                                <td>{scenario.scenarioName}</td>
                                <td>{(scenario.vehicles && scenario.vehicles.length) || 0}</td>
                                <td><img src={add} onClick={() => AddVehicle(scenario.scenarioName)} /></td>
                                <td><img src={edit} onClick={() => handleEdit(scenario)} /></td>
                                <td><img src={del} onClick={() => handleDelete(scenario.id)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default AllScenarioPage