import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";

type ServiceListProps = {
  services: readonly DentalService[];
};

export function ServiceList({ services }: ServiceListProps) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>;
}
