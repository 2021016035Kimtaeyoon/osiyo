import { BackHeader } from "@/components/BackHeader";
import { RouteScreen } from "@/components/RouteScreen";
import { getDemoRoute } from "@/lib/demoRoute";

export default function RoutePage() {
  const { origin, destination, comparison, blockingZone, dispersalAt } =
    getDemoRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="통제 피해서 길찾기" />
      <RouteScreen
        origin={origin}
        destination={destination}
        comparison={comparison}
        blockingZone={blockingZone}
        dispersalAt={dispersalAt}
      />
    </div>
  );
}
