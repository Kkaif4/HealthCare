export const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-primary/10">
    <span className="text-light/80">{label}:</span>
    <span className="font-medium">{value || 'N/A'}</span>
  </div>
);
