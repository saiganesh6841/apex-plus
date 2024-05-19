## apex-plus
# Vehicle Scenario Simulator

## Description
A React.js application to create, display, update, and delete scenarios and vehicles. Vehicles can move within a scenario based on their parameters.

## Features
- Create, display, update, and delete scenarios
- Create, display, update, and delete vehicles within scenarios
- Simulate vehicle movement based on speed and direction
- Vehicles hide when moving out of the container bounds

  ## Installation

1. Clone the repository
```bash
2.git clone <https://github.com/saiganesh6841/apex-plus.git>
3.cd apex-plus
4.Install dependencies

# Project Structure

vehicle-scenario-simulator
│
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── navbar.js
│   │   ├── homepage.js
|   |   ├── scenario.js
│   │   ├── allScenario.js
│   │   └── vehcile.js
│   ├── App.js
│   ├── index.js
│   └── App.css
├── db.json
├── package.json
└── README.md

# JSON Server
[
{
        "scenarioName": "",
        "time": "",
        "vehicles": [],
        "id": 2
    }
]
json server Link : https://apex-plus.onrender.com/api/data

