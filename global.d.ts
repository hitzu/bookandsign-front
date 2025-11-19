declare module "react-table";
declare module "feather-icons";
declare module "feather-icons-react";
declare module "fslightbox-react";
declare module "@ckeditor/ckeditor5-react";
declare module "@ckeditor/ckeditor5-build-decoupled-document";

// Fix for react-datepicker React 18 compatibility
declare module "react-datepicker" {
  import { ComponentType } from "react";
  export interface ReactDatePickerProps {
    [key: string]: any;
  }
  const ReactDatePicker: ComponentType<any>;
  export default ReactDatePicker;
}
