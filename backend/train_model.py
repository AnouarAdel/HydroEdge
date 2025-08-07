import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import joblib

def load_data(file_path="irrigation_data.csv"):
    """Loads the dataset from the specified CSV file."""
    try:
        df = pd.read_csv(file_path)
        print("Dataset loaded successfully.")
        return df
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        print("Please run 'python create_dataset.py' first to generate the training data.")
        return None

def train_model(df):
    """Trains the SVM model and saves it to a file."""
    if df is None:
        return

    # Define the features (inputs) and the target (output) for the model
    features = ['hour_of_day', 'temperature', 'soil_moisture', 'moisture_change_last_hour']
    target = 'irrigation_decision'

    X = df[features]
    y = df[target]

    # Split the data into a training set and a testing set for evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Data split into {len(X_train)} training samples and {len(X_test)} testing samples.")

    print("\nTraining the SVM model...")
    
    # Initialize the Support Vector Classifier with a balanced class weight
    # This helps the model handle the imbalanced nature of the irrigation decision.
    model = SVC(kernel='rbf', probability=True, random_state=42, class_weight='balanced')
    
    model.fit(X_train, y_train)
    print("Model training complete.")

    print("\nEvaluating model performance on the unseen test set...")
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, digits=4))

    model_filename = "irrigation_model.joblib"
    joblib.dump(model, model_filename)
    print(f"\nModel successfully saved to '{model_filename}'")

if __name__ == "__main__":
    dataset = load_data()
    train_model(dataset)