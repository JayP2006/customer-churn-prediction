
import { useState } from "react";
import "./App.css";

const initialData = {
  gender: "Male",
  SeniorCitizen: 0,
  Partner: "No",
  Dependents: "No",
  tenure: 1,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "DSL",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 50,
  TotalCharges: 50,
};

const sections = [
  {
    title: "Personal information",
    description: "Basic details about the customer",
    icon: "01",
    fields: [
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
      },
      {
        name: "SeniorCitizen",
        label: "Senior citizen",
        type: "select",
        options: [
          { label: "No", value: 0 },
          { label: "Yes", value: 1 },
        ],
      },
      {
        name: "Partner",
        label: "Has a partner?",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "Dependents",
        label: "Has dependents?",
        type: "select",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Service information",
    description: "Subscription and additional services",
    icon: "02",
    fields: [
      {
        name: "tenure",
        label: "Customer tenure",
        suffix: "months",
        type: "number",
        min: 0,
        max: 1000,
      },
      {
        name: "PhoneService",
        label: "Phone service",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "MultipleLines",
        label: "Multiple lines",
        type: "select",
        options: ["No", "Yes", "No phone service"],
      },
      {
        name: "InternetService",
        label: "Internet service",
        type: "select",
        options: ["DSL", "Fiber optic", "No"],
      },
      ...[
        ["OnlineSecurity", "Online security"],
        ["OnlineBackup", "Online backup"],
        ["DeviceProtection", "Device protection"],
        ["TechSupport", "Technical support"],
        ["StreamingTV", "Streaming TV"],
        ["StreamingMovies", "Streaming movies"],
      ].map(([name, label]) => ({
        name,
        label,
        type: "select",
        options: ["No", "Yes", "No internet service"],
      })),
    ],
  },
  {
    title: "Billing & payments",
    description: "Contract and financial information",
    icon: "03",
    fields: [
      {
        name: "Contract",
        label: "Contract type",
        type: "select",
        options: ["Month-to-month", "One year", "Two year"],
      },
      {
        name: "PaperlessBilling",
        label: "Paperless billing",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "PaymentMethod",
        label: "Payment method",
        type: "select",
        options: [
          "Electronic check",
          "Mailed check",
          "Bank transfer (automatic)",
          "Credit card (automatic)",
        ],
      },
      {
        name: "MonthlyCharges",
        label: "Monthly charges",
        prefix: "$",
        type: "number",
        min: 0,
        step: "0.01",
      },
      {
        name: "TotalCharges",
        label: "Total charges",
        prefix: "$",
        type: "number",
        min: 0,
        step: "0.01",
      },
    ],
  },
];

function App() {
  const [formData, setFormData] = useState(initialData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const completedFields = Object.keys(formData).length;

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    setResult(null);
  };

  const handleReset = () => {
    setFormData(initialData);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "The prediction request failed."
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      setResult({
        error:
          error.message ||
          "Unable to connect to the backend. Make sure FastAPI is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isChurn = result?.prediction === 1;
  const probability = Number(result?.churn_probability ?? 0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#top" className="brand">
          <span className="brand-icon">C</span>
          <span>
            <strong>ChurnIQ</strong>
            <small>INTELLIGENCE PLATFORM</small>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <a href="#top" className="nav-item active">
          <span className="nav-icon">◈</span>
          Customer prediction
        </a>

        <a href="#customer-form" className="nav-item">
          <span className="nav-icon">▤</span>
          Customer profile
        </a>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">✦</span>
            <strong>AI-powered insights</strong>
            <p>Turn customer data into actionable predictions.</p>
          </div>

          <div className="user-profile">
            <div className="avatar">ML</div>
            <div>
              <strong>ML Workspace</strong>
              <small>Prediction dashboard</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar">
          <div className="breadcrumb">
             <strong>CustomerChurn prediction</strong>
          </div>

          <div className="topbar-right">
            <span className="live-dot" />
            <span className="api-status">Prediction workspace</span>
            <div className="top-avatar">C</div>
          </div>
        </header>

        <div className="page-container">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="sparkle">✦</span>
                MACHINE LEARNING ANALYTICS
              </div>

              <h1>
                Customer churn
                <br />
                <span>prediction platform.</span>
              </h1>

              <p>
                Understand customer retention risk with intelligent,
                data-driven predictions. Complete the customer profile
                to generate a prediction using your trained ML model.
              </p>

              <div className="hero-tags">
                <span>◈ Predictive analytics</span>
                <span>✓ Model powered</span>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <div className="visual-core">
                <span className="core-symbol">✳</span>
                <small>CHURN AI</small>
              </div>
              <span className="orbit-node node-one">↗</span>
              <span className="orbit-node node-two">◉</span>
              <span className="orbit-node node-three">✦</span>
            </div>
          </section>

          <section className="overview-grid">
            <article className="overview-card">
              <div className="overview-icon violet">◈</div>
              <div>
                <span className="metric-label">MODEL STATUS</span>
                <h3>ML Prediction</h3>
                <p>Trained model integration</p>
              </div>
              <span className="card-indicator">01</span>
            </article>

            <article className="overview-card">
              <div className="overview-icon blue">◎</div>
              <div>
                <span className="metric-label">CUSTOMER DATA</span>
                <h3>{completedFields} Features</h3>
                <p>Input parameters available</p>
              </div>
              <span className="card-indicator">02</span>
            </article>

            <article className="overview-card">
              <div className="overview-icon green">↗</div>
              <div>
                <span className="metric-label">ANALYSIS</span>
                <h3>Individual risk</h3>
                <p>Customer-level prediction</p>
              </div>
              <span className="card-indicator">03</span>
            </article>
          </section>

          <div className="workspace-heading" id="customer-form">
            <div>
              <div className="section-kicker">CUSTOMER ASSESSMENT</div>
              <h2>Build a customer profile</h2>
              <p>
                Provide accurate information to estimate the likelihood
                of customer churn.
              </p>
            </div>

            <button
              className="reset-button"
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              ↺ <span>Reset form</span>
            </button>
          </div>

          <div className="workspace-grid">
            <form className="form-panel" onSubmit={handleSubmit}>
              {sections.map((section) => (
                <section className="form-section" key={section.title}>
                  <div className="form-section-heading">
                    <div className="section-number">{section.icon}</div>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                  </div>

                  <div className="fields-grid">
                    {section.fields.map((field) => (
                      <div className="field" key={field.name}>
                        <label htmlFor={field.name}>
                          {field.label}
                        </label>

                        <div className="input-wrap">
                          {field.prefix && (
                            <span className="input-prefix">
                              {field.prefix}
                            </span>
                          )}

                          {field.type === "select" ? (
                            <select
                              id={field.name}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              {field.options.map((option) => {
                                const value =
                                  typeof option === "object"
                                    ? option.value
                                    : option;
                                const label =
                                  typeof option === "object"
                                    ? option.label
                                    : option;

                                return (
                                  <option
                                    key={String(value)}
                                    value={value}
                                  >
                                    {label}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <input
                              id={field.name}
                              name={field.name}
                              type="number"
                              min={field.min}
                              max={field.max}
                              step={field.step || "1"}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required
                              disabled={loading}
                            />
                          )}

                          {field.suffix && (
                            <span className="input-suffix">
                              {field.suffix}
                            </span>
                          )}

                          {field.type === "select" && (
                            <span className="select-chevron">⌄</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className="form-footer">
                <div className="privacy-note">
                  <span>◈</span>
                  <p>
                    Your input is processed by the connected prediction
                    API.
                  </p>
                </div>

                <button
                  type="submit"
                  className="predict-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Analyzing customer...
                    </>
                  ) : (
                    <>
                      Generate prediction <span>↗</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <aside className="result-column">
              <div className="result-panel">
                <div className="result-heading">
                  <div>
                    <span className="section-kicker">ANALYSIS OUTPUT</span>
                    <h3>Prediction result</h3>
                  </div>
                  <div className="result-heading-icon">✳</div>
                </div>

                {!result && !loading && (
                  <div className="empty-result">
                    <div className="empty-illustration">
                      <div className="empty-ring ring-a" />
                      <div className="empty-ring ring-b" />
                      <span>⌁</span>
                    </div>
                    <h4>Ready to analyze</h4>
                    <p>
                      Submit the customer profile to see the model's
                      prediction and estimated churn probability.
                    </p>
                    <div className="result-checklist">
                      <div><span>✓</span> Customer profile</div>
                      <div><span>✓</span> Service information</div>
                      <div><span>✓</span> Billing details</div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="loading-result">
                    <span className="large-spinner" />
                    <h4>Analyzing customer data</h4>
                    <p>Waiting for your machine learning model...</p>
                  </div>
                )}

                {result?.error && (
                  <div className="error-result">
                    <span className="error-symbol">!</span>
                    <h4>Prediction unsuccessful</h4>
                    <p>{result.error}</p>
                    <button
                      className="reset-button"
                      type="button"
                      onClick={() => setResult(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {result && !result.error && (
                  <div className="prediction-output">
                    <div
                      className={`prediction-status ${
                        isChurn ? "risk-high" : "risk-low"
                      }`}
                    >
                      <span className="status-symbol">
                        {isChurn ? "!" : "✓"}
                      </span>
                      <div>
                        <span className="metric-label">
                          MODEL PREDICTION
                        </span>
                        <h4>
                          {isChurn
                            ? "Churn predicted"
                            : "Churn not predicted"}
                        </h4>
                        <p>
                          {isChurn
                            ? "The model predicts that this customer may leave."
                            : "The model predicts that this customer will stay."}
                        </p>
                      </div>
                    </div>

                    <div className="probability-card">
                      <span className="metric-label">
                        CHURN PROBABILITY
                      </span>
                      <div className="probability-value">
                        <strong>{probability.toFixed(2)}%</strong>
                        <span>Model estimate</span>
                      </div>
                      <div
                        className="probability-track"
                        role="progressbar"
                        aria-label="Churn probability"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(
                          100,
                          Math.max(0, probability)
                        )}
                      >
                        <div
                          className={`probability-fill ${
                            isChurn ? "fill-risk" : "fill-safe"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, probability)
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="probability-scale">
                        <span>0% · Low</span>
                        <span>100% · High</span>
                      </div>
                    </div>

                    <div className="result-detail">
                      <span>Prediction class</span>
                      <strong>{result.prediction}</strong>
                    </div>

                    <div className="result-detail">
                      <span>Assessment</span>
                      <strong>{isChurn ? "At risk" : "Not flagged"}</strong>
                    </div>

                    <div className="result-disclaimer">
                      <span>ⓘ</span>
                      This result is a model estimate, not a guarantee of
                      future customer behavior.
                    </div>
                  </div>
                )}
              </div>

              <div className="insight-card">
                <div className="insight-icon">✦</div>
                <div>
                  <h4>Retention intelligence</h4>
                  <p>
                    Use predictions to identify customers who may need
                    additional support or retention offers.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <footer className="page-footer">
            <span>ChurnIQ <span className="footer-dot">·</span> Customer analytics</span>
            
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
