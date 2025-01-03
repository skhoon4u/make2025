import React from "react";
import "../styles/PlanDisplay.css";

const PlanDisplay = ({ planData, editing, onPlanChange }) => {
  const handleInputChange = (field, period, index, value) => {
    if (editing && onPlanChange) {
      const updatedData = { ...planData };
      updatedData[field][period][index] = value;
      onPlanChange(field, period, updatedData[field][period]);
    }
  };

  return (
    <div>
      {/* 주차별 계획 */}
      <div className="plan-section">
        <div className="plan-box">
          <h3 className="plan-title">Weekly Plan</h3>
          {Object.entries(planData.weeklyDetail || {}).map(
            ([week, plans], idx) => {
              const [monthPart, weekPart] = week.split(" "); // "n월 m주차"를 분리
              return (
                <div key={idx} className="plan-item-container">
                  <div className="plan-item-box">
                    {monthPart}
                    <br />
                    {weekPart}
                  </div>
                  <ul className="plan-item-list">
                    {(Array.isArray(plans) ? plans : []).map((plan, index) => (
                      <li key={index} className="plan-item-content">
                        {editing ? (
                          <input
                            type="text"
                            className="edit-input"
                            value={plan}
                            onChange={(e) =>
                              handleInputChange(
                                "weeklyDetail",
                                week,
                                index,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          plan
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* 월별 계획 */}
      <div className="plan-section">
        <div className="plan-box">
          <h3 className="plan-title">Monthly Plan</h3>
          {Object.entries(planData.monthlyPlan || {}).map(
            ([month, plans], idx) => (
              <div key={idx} className="plan-item-container">
                <div className="plan-item-box">{month}</div>
                <ul className="plan-item-list">
                  {(Array.isArray(plans) ? plans : []).map((plan, index) => (
                    <li key={index} className="plan-item-content">
                      {editing ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={plan}
                          onChange={(e) =>
                            handleInputChange(
                              "monthlyPlan",
                              month,
                              index,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        plan
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;
