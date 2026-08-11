import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { AccountOperationsProps } from "../patterns/AccountOperations.js";
import type { BackofficeApprovalProps } from "../patterns/BackofficeApproval.js";
import type { CaseManagementProps } from "../patterns/CaseManagement.js";
import type { DenseOperationalListProps } from "../patterns/DenseOperationalList.js";
import type { PricingOperationsProps } from "../patterns/PricingOperations.js";
import type { SidebarProps } from "../patterns/Sidebar.js";
import type { TicketQueueProps } from "../patterns/TicketQueue.js";
import type { TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type InternalOperationsConsoleState = "loaded" | "loading" | "empty" | "permission" | "error" | "offline" | "disabled";
export type InternalOperationsConsoleDensity = SurfaceDensity;
export type InternalOperationsConsoleModule = "cases" | "tickets" | "accounts" | "pricing" | "backoffice" | "growth" | (string & {});

export interface InternalOperationsConsoleProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: InternalOperationsConsoleDensity;
  tone?: SurfaceTone;
  state?: InternalOperationsConsoleState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedModule?: InternalOperationsConsoleModule;
  defaultSelectedModule?: InternalOperationsConsoleModule;
  onSelectedModuleChange?: (key: string, route: unknown, event: MouseEvent<HTMLButtonElement>) => void;
  drawerOpen?: boolean;
  defaultDrawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  cases?: CaseManagementProps;
  tickets?: TicketQueueProps;
  accounts?: AccountOperationsProps;
  pricing?: PricingOperationsProps;
  backoffice?: BackofficeApprovalProps;
  growth?: DenseOperationalListProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface InternalOperationsConsoleComponent extends ForwardRefExoticComponent<InternalOperationsConsoleProps & RefAttributes<HTMLDivElement>> {
  displayName: "InternalOperationsConsole";
}

export const InternalOperationsConsole: InternalOperationsConsoleComponent;
