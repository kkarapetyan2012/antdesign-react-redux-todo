export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return;
    }
};
  
export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (error) {
        console.error('Failed to save state to localStorage:', error);
    }
};
  