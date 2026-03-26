import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# OPTIONAL visualization
import matplotlib.pyplot as plt
import seaborn as sns


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

data_path = os.path.join(BASE_DIR, "datasets", "loan_fraud_detection_dataset_50k.csv")

data = pd.read_csv(data_path)

# Features & Target
X = data.drop(["fraud_probability", "fraud_flag"], axis=1)
y = data["fraud_flag"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Models
models = {
    "RandomForest": RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42
    ),
    "XGBoost": XGBClassifier(
        n_estimators=200,
        learning_rate=0.05,
        use_label_encoder=False,
        eval_metric='logloss'
    )
}

best_model = None
best_score = 0

# Training & Evaluation
for name, model in models.items():

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    prob = model.predict_proba(X_test)[:, 1]

    # Metrics
    acc = accuracy_score(y_test, preds)
    auc = roc_auc_score(y_test, prob)
    precision = precision_score(y_test, preds)
    recall = recall_score(y_test, preds)
    f1 = f1_score(y_test, preds)
    cm = confusion_matrix(y_test, preds)

    print("\n==============================")
    print(f"Model: {name}")
    print("==============================")
    print(f"Accuracy  : {acc:.4f}")
    print(f"AUC       : {auc:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1 Score  : {f1:.4f}")

    print("\nConfusion Matrix:")
    print(cm)

    print("\nClassification Report:")
    print(classification_report(y_test, preds))

    # OPTIONAL: Confusion Matrix Plot
    plt.figure()
    sns.heatmap(cm, annot=True, fmt="d")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title(f"Confusion Matrix - {name}")
    plt.show()

    # Select Best Model (based on AUC)
    if auc > best_score:
        best_score = auc
        best_model = model

# Save best model
models_dir = os.path.join(BASE_DIR, "models")
os.makedirs(models_dir, exist_ok=True)

joblib.dump(best_model, os.path.join(models_dir, "fraud_model.pkl"))

print("\nFraud model saved successfully!")