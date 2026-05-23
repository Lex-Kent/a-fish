"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

function Calendar(props: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker {...props} />;
}

export { Calendar };