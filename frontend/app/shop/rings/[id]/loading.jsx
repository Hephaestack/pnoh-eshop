"use client";

import React from "react";
import { IndividualProductSkeleton } from "../../../../components/skeletons/IndividualProductSkeleton";

export default function Loading() {
  // Shown during server-side fetch of the product page
  return <IndividualProductSkeleton />;
}
