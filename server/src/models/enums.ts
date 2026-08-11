export const userRoles = ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] as const;
export type UserRole = (typeof userRoles)[number];

export const customerStatuses = ['LEAD', 'ACTIVE', 'INACTIVE'] as const;
export type CustomerStatus = (typeof customerStatuses)[number];

export const customerTypes = ['RETAIL', 'WHOLESALE', 'DISTRIBUTOR'] as const;
export type CustomerType = (typeof customerTypes)[number];

export const movementTypes = ['IN', 'OUT'] as const;
export type MovementType = (typeof movementTypes)[number];

export const movementReferenceTypes = ['CHALLAN', 'MANUAL_ADJUSTMENT', 'PURCHASE_ORDER'] as const;
export type MovementReferenceType = (typeof movementReferenceTypes)[number];

export const challanStatuses = ['DRAFT', 'CONFIRMED', 'CANCELLED'] as const;
export type ChallanStatus = (typeof challanStatuses)[number];

