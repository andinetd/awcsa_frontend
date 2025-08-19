export default function AdoptionDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Children Statistics</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Care Centers</span>
        </div>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
    </>
  );
}
