import { BackHeader } from "@/components/BackHeader";
import { SearchClient } from "@/components/SearchClient";

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="검색" />
      <SearchClient />
    </div>
  );
}
