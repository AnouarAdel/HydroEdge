import numpy as np
import joblib
from flask import Flask, jsonify
from flask_cors import CORS

# --- Initialize Flask App and CORS ---
app = Flask(__name__)
CORS(app) 

# --- Load the Trained AI Model ---
try:
    model = joblib.load("irrigation_model.joblib")
    print("AI model loaded successfully.")
except FileNotFoundError:
    print("Error: Model file 'irrigation_model.joblib' not found.")
    print("Please run 'python train_model.py' first to train and save the model.")
    model = None

# --- Digital Twin Simulator Class ---
class IrrigationSimulator:
    """Manages the state and logic of the virtual farm plot."""
    def __init__(self):
        self.reset()
        print("Digital twin simulator initialized.")

    def reset(self):
        """Resets the simulation to its initial state."""
        self.hour = 0
        self.current_moisture = 80.0
        self.previous_moisture = 80.0

    def _get_temperature(self):
        """Calculates the temperature for the current hour of the simulation."""
        return 18 + 10 * np.sin((self.hour - 9) * np.pi / 12)

    def step(self):
        """Advances the simulation by one hour."""
        if model is None:
            raise RuntimeError("Model is not loaded. Cannot run simulation.")
        
        moisture_change_last_hour = self.current_moisture - self.previous_moisture
        temperature = self._get_temperature()

        # Prepare the feature vector for the AI model
        features = np.array([[
            self.hour,
            temperature,
            self.current_moisture,
            moisture_change_last_hour
        ]])

        # Get the AI model's prediction
        irrigation_decision = model.predict(features)[0]

        # Store the current moisture before it's updated for the next step's calculation
        next_previous_moisture = self.current_moisture

        # Update the environment based on the AI's decision and natural processes
        if irrigation_decision == 1:
            self.current_moisture += 50.0

        if 6 <= self.hour < 18:
            evaporation = 1.5
        else:
            evaporation = 0.5
        
        temp_effect = (temperature - 23) * 0.05
        self.current_moisture -= (evaporation + temp_effect)
        
        if self.current_moisture < 0: self.current_moisture = 0
        if self.current_moisture > 100: self.current_moisture = 100

        self.previous_moisture = next_previous_moisture
        
        # Prepare the JSON response for the frontend
        state = {
            "hour": self.hour,
            "temperature": round(temperature, 2),
            "soil_moisture": round(self.current_moisture, 2),
            "irrigation_on": bool(irrigation_decision)
        }
        
        self.hour = (self.hour + 1) % 24 # Advance time
        
        return state

# --- API Endpoints ---
simulator = IrrigationSimulator()

@app.route("/api/simulation_step", methods=["POST"])
def simulation_step():
    """Provides the next time-step of the simulation to the frontend."""
    new_state = simulator.step()
    return jsonify(new_state)

@app.route("/api/reset_simulation", methods=["POST"])
def reset_simulation():
    """Resets the simulation state."""
    simulator.reset()
    return jsonify({"message": "Simulation has been reset."})

# --- Run the Flask Server ---
if __name__ == "__main__":
    print("Starting the HydroEdge backend server...")
    app.run(debug=False, host='0.0.0.0', port=5000)