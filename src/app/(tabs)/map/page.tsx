import { getAssemblies, getConflictAlerts, getCongestion } from "@/lib/mock";
import { MapScreen } from "@/components/MapScreen";

export default function MapPage() {
  const assemblies = getAssemblies();
  const liveAssemblies = assemblies.filter((a) => a.status === "진행중");
  const conflictAlerts = getConflictAlerts();
  const congestion = getCongestion();
  const focus =
    liveAssemblies.find((a) => a.marchRoute) ?? liveAssemblies[0] ?? assemblies[0];

  return (
    <MapScreen
      liveAssemblies={liveAssemblies}
      conflictAlerts={conflictAlerts}
      congestion={congestion}
      focus={focus}
    />
  );
}
