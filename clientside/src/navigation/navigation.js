import { BrowserRouter, Route, Routes } from "react-router-dom"
import ScenarioPage from "../components/scenario"
import VehiclePage from "../components/vehicle"
import Navbar from "../components/navbar"
import AllScenarioPage from "../components/allScenario"
import HomePage from "../components/homepage"




const Navigation = () => {

    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" Component={HomePage} />
                    <Route path="/scenario" Component={ScenarioPage} />
                    <Route path="/vehicle" Component={VehiclePage} />
                    <Route path="/allScenario" Component={AllScenarioPage} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default Navigation