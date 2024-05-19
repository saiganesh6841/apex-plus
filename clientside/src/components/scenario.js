import axios from "axios";
import { useEffect, useState } from "react";
import "./scenario.css";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../App";

const ScenarioPage = () => {
    const [scenarioName, setScenarioName] = useState("");
    const [time, setTime] = useState("");
    const [scenarioError, setScenarioError] = useState("");
    const [timeError, setTimeError] = useState("");
    const [scenarios, setScenarios] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const editingScenario = location.state?.scenario || null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/data`);
                setScenarios(response.data);
                if (editingScenario) {
                    setScenarioName(editingScenario.scenarioName);
                    setTime(editingScenario.time);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [editingScenario]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setScenarioError("");
        setTimeError("");
        // Validate scenario name
        if (!scenarioName) {
            setScenarioError("Scenario name is required");
            return;
        }

        // Validate time
        if (!time) {
            setTimeError("Time is required");
            return;
        }
        const scenarioExists = scenarios.some(scenario => scenario.scenarioName === scenarioName && scenario.id !== editingScenario?.id);
        if (scenarioExists) {
            alert("Scenario name already exists!");
            return;
        }
        try {
            const formData = { scenarioName, time, vehicles: editingScenario ? editingScenario.vehicles : [] };
            if (editingScenario) {
                await axios.put(`${baseURL}/api/data/${editingScenario.id}`, formData);
            } else {
                await axios.post(`${baseURL}/api/data`, formData);
            }
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleReset = () => {
        setScenarioName("");
        setTime("");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <h3>Scenario/Add</h3>
            <h1 className="scenarioNamee">{editingScenario ? "Edit Scenario" : "Add Scenario"}</h1>
            <div className="scenario-page">
                <form onSubmit={handleSubmit}>
                    <div className="display">
                        <div className="input-container">
                            <label>Scenario Name</label>
                            <input
                                type="text"
                                name="scenarioName"
                                placeholder="Test Scenario"
                                value={scenarioName}
                                onChange={(e) => setScenarioName(e.target.value)}
                            />
                            <div> <span className="error">{scenarioError}</span></div>
                        </div>
                        <div className="input-container">
                            <label>Scenario Time (seconds)</label>
                            <input
                                type="text"
                                name="time"
                                placeholder="10"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            // required
                            />
                            <div> <span className="error">{timeError}</span></div>
                        </div>
                    </div>
                    <br />
                    <div className="button-container">
                        <button type="submit" style={{ backgroundColor: "green" }}>
                            {editingScenario ? "Update" : "Add"}
                        </button>
                        <button type="button" style={{ backgroundColor: "orange" }} onClick={handleReset}>
                            Reset
                        </button>
                        <button type="button" style={{ backgroundColor: "blue" }} onClick={handleGoBack}>
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ScenarioPage;
