import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends object = unknown, TValue = unknown> {
    hideOnMobile?: boolean;
    title?: string;
  }
}
