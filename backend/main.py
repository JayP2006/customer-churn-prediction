from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd


# --------------------------------------------------
# 1. CREATE FASTAPI APP
# --------------------------------------------------

app = FastAPI()


# --------------------------------------------------
# 2. ALLOW REACT FRONTEND
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://customer-churn-prediction-pvrz.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# 3. LOAD MODEL
# --------------------------------------------------

with open("churn_model.pkl", "rb") as file:
    model = pickle.load(file)


# --------------------------------------------------
# 4. LOAD SCALER
# --------------------------------------------------

with open("scaler.pkl", "rb") as file:
    scaler = pickle.load(file)


# --------------------------------------------------
# 5. LOAD ENCODERS
# --------------------------------------------------

with open("encoders.pkl", "rb") as file:
    encoders = pickle.load(file)


print("Model loaded successfully!")
print("Scaler loaded successfully!")
print("Encoders loaded successfully!")


# --------------------------------------------------
# 6. CUSTOMER INPUT MODEL
# --------------------------------------------------

class CustomerData(BaseModel):

    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str

    tenure: int

    PhoneService: str
    MultipleLines: str

    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str

    Contract: str
    PaperlessBilling: str
    PaymentMethod: str

    MonthlyCharges: float
    TotalCharges: float


# --------------------------------------------------
# 7. HOME ROUTE
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Customer Churn Prediction API is running"
    }


# --------------------------------------------------
# 8. PREDICTION ROUTE
# --------------------------------------------------

@app.post("/predict")
def predict_churn(customer: CustomerData):

    try:

        # ------------------------------------------
        # Convert input to dictionary
        # ------------------------------------------

        data = customer.dict()


        # ------------------------------------------
        # Convert dictionary to DataFrame
        # ------------------------------------------

        df = pd.DataFrame([data])


        # ------------------------------------------
        # CATEGORICAL COLUMNS
        # ------------------------------------------

        categorical_columns = [
            "gender",
            "Partner",
            "Dependents",
            "PhoneService",
            "MultipleLines",
            "InternetService",
            "OnlineSecurity",
            "OnlineBackup",
            "DeviceProtection",
            "TechSupport",
            "StreamingTV",
            "StreamingMovies",
            "Contract",
            "PaperlessBilling",
            "PaymentMethod"
        ]


        # ------------------------------------------
        # ENCODE CATEGORICAL FEATURES
        # ------------------------------------------

        for column in categorical_columns:

            encoder = encoders[column]

            df[column] = encoder.transform(df[column])


        # ------------------------------------------
        # SCALE NUMERICAL FEATURES
        # ------------------------------------------

        numerical_columns = [
            "tenure",
            "MonthlyCharges",
            "TotalCharges"
        ]

        df[numerical_columns] = scaler.transform(
            df[numerical_columns]
        )


        # ------------------------------------------
        # PREDICTION
        # ------------------------------------------
        print(model.predict(df)); 
        prediction = model.predict(df)[0]


        # ------------------------------------------
        # PREDICTION PROBABILITY
        # ------------------------------------------
        print(model.predict_proba(df))
        probability = model.predict_proba(df)[0][1]


        # ------------------------------------------
        # RESULT
        # ------------------------------------------

        if prediction == 1:

            result = "Customer will Churn"

        else:

            result = "Customer will Not Churn"


        return {
            "prediction": int(prediction),
            "result": result,
            "churn_probability": round(
                float(probability) * 100,
                2
            )
        }


    except Exception as e:

        return {
            "error": str(e)
        }
