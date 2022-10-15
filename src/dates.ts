import { format, parseJSON } from "date-fns"

export function formatDateString(asStr: string): string {
  return format(parseJSON(asStr), "PPP")
}
