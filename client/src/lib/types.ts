/**
 * Extended user type for staff dashboards.
 *
 * The `auth.me` tRPC query returns a `User` row which doesn't include
 * `staffRef` or `displayName`.  Some session shapes (staffuser__*) carry
 * these fields at runtime even though the Drizzle `User` type omits them.
 * This alias lets dashboard code access those optional properties without
 * scattering `as any` casts everywhere.
 */
export type StaffUser = {
  id?: number;
  openId?: string;
  name?: string | null;
  displayName?: string;
  email?: string | null;
  staffRef?: string;
  hamzuryRole?: string | null;
  department?: string | null;
  role?: string;
  [key: string]: unknown;
};
