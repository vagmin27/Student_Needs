import React from "react";
import { pricePanelData } from "./PricePanelData";

/**
 * Price Panel Component
 */
function PricePanel() {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-[var(--bg-secondary)]/30 rounded-[var(--radius-lg)]">
      {pricePanelData?.map((each, index) => {
        return (
          <div 
            key={index} 
            className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-[var(--radius-md)] p-6 w-[280px] text-center shadow-[var(--shadow-sm)] border border-[var(--border-color)] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[var(--shadow-md)] transition-all duration-300"
          >
            <ol className="list-none p-0 m-0">
              <li className="flex justify-center mb-4 text-3xl">{each.icon}</li>
              <li className="text-lg font-bold text-[var(--primary)] mb-3">{each.plan}</li>
              <li className="text-sm text-[var(--text-secondary)] py-2.5 border-t border-[var(--border-color)]">{each.description}</li>
              <li className="text-sm text-[var(--text-secondary)] py-2.5 border-t border-[var(--border-color)]">{each.specifics}</li>
              <li className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 pt-2">{each.price}</li>
            </ol>
          </div>
        );
      })}
    </div>
  );
}

PricePanel.propTypes = {};

export default PricePanel;