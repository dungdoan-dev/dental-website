import { test } from "node:test";
import assert from "node:assert/strict";
import { clinicFormSchema } from "./admin.schema";

test("clinic directions accept web links, allow hiding the button and reject unsafe URLs", () => {
  const clinic = {
    id: "clinic-1", name: "Cơ sở 1", address: "TP.HCM", phone: "1900 966 960",
    workingHours: "08:00–20:00", description: "", image: "/images/clinic.jpg",
  };
  assert.equal(clinicFormSchema.parse({ ...clinic, googleMapsUrl: "https://maps.app.goo.gl/example" }).googleMapsUrl, "https://maps.app.goo.gl/example");
  assert.equal(clinicFormSchema.parse({ ...clinic, googleMapsUrl: "" }).googleMapsUrl, "");
  assert.equal(clinicFormSchema.parse(clinic).googleMapsUrl, undefined);
  assert.equal(clinicFormSchema.safeParse({ ...clinic, googleMapsUrl: "javascript:alert(1)" }).success, false);
  assert.equal(clinicFormSchema.safeParse({ ...clinic, googleMapsUrl: "https://user:password@example.com" }).success, false);
});
