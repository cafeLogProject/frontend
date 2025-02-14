import { TabsProps } from './types';
import styles from './Tabs.module.scss';

export const Tabs = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = '' 
}: TabsProps) => {
  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};