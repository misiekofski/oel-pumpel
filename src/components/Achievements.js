import React from 'react';

const Achievements = ({ 
  showAchievements, 
  setShowAchievements, 
  achievements, 
  money, 
  oilFields, 
  stats, 
  technologies, 
  ships, 
  formatNumber 
}) => {
  if (!showAchievements) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
      <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 Achievements</h2>
          <button onClick={() => setShowAchievements(false)} className="close-btn">×</button>
        </div>
        <div className="achievements-list">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="progress">
                    Progress: {(() => {
                      let current = 0;
                      switch (achievement.type) {
                        case 'money': current = money; break;
                        case 'oilFields': current = oilFields.length; break;
                        case 'totalOilDrilled': current = stats.totalOilDrilled; break;
                        case 'shipmentsCompleted': current = stats.shipmentsCompleted; break;
                        case 'technologiesUnlocked': current = technologies.filter(t => t.unlocked).length; break;
                        case 'ships': current = ships.length; break;
                        case 'continentsTraded': current = stats.continentsTraded.size; break;
                        default: current = 0; break;
                      }
                      return `${formatNumber(current)} / ${formatNumber(achievement.target)}`;
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
