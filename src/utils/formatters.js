export const formatTempo = (seconds) => {
  if (seconds >= 86400) {
    const dias = Math.floor(seconds / 86400);
    const horas = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${dias}d ${horas}h ${mins}m`;
  }
  
  if (seconds >= 3600) {
    const horas = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${horas}h ${mins}m ${secs}s`;
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
