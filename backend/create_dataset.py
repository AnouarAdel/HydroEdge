import pandas as pd
import numpy as np

# --- Simulation Parameters ---
# Defines the scope and behavior of the generated dataset.
NUM_DAYS = 1825 # 5 years
HOURS_IN_DAY = 24
START_MOISTURE = 80.0
IRRIGATION_THRESHOLD = 35.0
IRRIGATION_AMOUNT = 50.0

DAY_EVAPORATION_RATE = 1.5
NIGHT_EVAPORATION_RATE = 0.5
TEMP_INFLUENCE = 0.05

def get_temperature(hour):
    """Simulates a simple daily temperature curve using a sine wave."""
    return 18 + 10 * np.sin((hour - 9) * np.pi / 12)

def generate_simulation_data():
    """Generates the full time-series dataset for training."""
    data = []
    current_moisture = START_MOISTURE

    for day in range(NUM_DAYS):
        for hour in range(HOURS_IN_DAY):
            timestamp = pd.to_datetime(f"2025-07-01") + pd.to_timedelta(f"{day} days {hour} hours")
            temperature = get_temperature(hour)
            
            # The ground truth is established here: irrigate if moisture is below the threshold.
            should_irrigate = 1 if current_moisture < IRRIGATION_THRESHOLD else 0
            
            # The state is saved *before* the irrigation is applied for the next cycle.
            # This correctly associates low moisture with the decision to irrigate.
            data.append([timestamp, hour, temperature, current_moisture, should_irrigate])
            
            # Update the moisture for the next hour's calculation
            if should_irrigate == 1:
                current_moisture += IRRIGATION_AMOUNT
            
            # Apply environmental evaporation
            if 6 <= hour < 18:
                evaporation = DAY_EVAPORATION_RATE
            else:
                evaporation = NIGHT_EVAPORATION_RATE
            
            temp_effect = (temperature - 23) * TEMP_INFLUENCE
            current_moisture -= (evaporation + temp_effect)
            
            if current_moisture < 0:
                current_moisture = 0

    columns = ['timestamp', 'hour_of_day', 'temperature', 'soil_moisture', 'irrigation_decision']
    df = pd.DataFrame(data, columns=columns)
    
    # Feature Engineering: Add a feature for the rate of moisture change.
    df['moisture_change_last_hour'] = df['soil_moisture'].diff(1).fillna(0)
    
    return df

if __name__ == "__main__":
    print("Generating training dataset for the HydroEdge AI model...")
    dataset = generate_simulation_data()
    
    file_path = "irrigation_data.csv"
    dataset.to_csv(file_path, index=False)
    
    print(f"Successfully generated {len(dataset)} records.")
    print(f"Training data saved to '{file_path}'")