import { StylesConfig } from "react-select";

/**
 * Estilos personalizados para react-select multi-select
 * Compatible con tema claro y oscuro usando variables CSS de Bootstrap
 */
export const multiSelectStyles: StylesConfig<any, true> = {
  // Estilo del contenedor principal
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "var(--bs-body-bg, #fff)",
    borderColor: state.isFocused
      ? "#04A9F5"
      : "var(--bs-border-color, #dee2e6)",
    boxShadow: state.isFocused
      ? "0 0 0 0.2rem rgba(4, 169, 245, 0.25)"
      : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#04A9F5" : "#adb5bd",
    },
    minHeight: "38px",
    borderRadius: "0.375rem",
  }),

  // Estilo del menú dropdown
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--bs-body-bg, #fff)",
    border: "1px solid var(--bs-border-color, #dee2e6)",
    borderRadius: "0.375rem",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
  }),

  // Estilo de cada opción en el menú
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected
      ? "#04A9F5"
      : state.isFocused
      ? "rgba(4, 169, 245, 0.1)"
      : "var(--bs-body-bg, #fff)",
    color: state.isSelected ? "#fff" : "var(--bs-body-color, #212529)",
    cursor: "pointer",
    padding: "10px 12px",
    "&:active": {
      backgroundColor: "#04A9F5",
      color: "#fff",
    },
  }),

  // Estilo del contenedor de valores múltiples
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#04A9F5",
    borderRadius: "6px",
    padding: "2px 4px",
    margin: "2px",
    boxShadow: "0 2px 4px rgba(4, 169, 245, 0.2)",
  }),

  // Estilo del texto dentro de cada chip
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: "500",
    padding: "4px 8px",
  }),

  // Estilo del botón de eliminar en cada chip
  multiValueRemove: (styles, state) => ({
    ...styles,
    color: "#fff",
    backgroundColor: "transparent",
    borderRadius: "0 6px 6px 0",
    padding: "4px 6px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#fff",
    },
  }),

  // Estilo del placeholder
  placeholder: (styles) => ({
    ...styles,
    color: "var(--bs-secondary-color, #6c757d)",
  }),

  // Estilo del input de búsqueda
  input: (styles) => ({
    ...styles,
    color: "var(--bs-body-color, #212529)",
  }),

  // Estilo del indicador de dropdown
  indicatorsContainer: (styles) => ({
    ...styles,
    padding: "4px",
  }),

  // Estilo del separador
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "var(--bs-border-color, #dee2e6)",
  }),
};

export const singleSelectStyles: StylesConfig<any, false> = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "var(--bs-body-bg, #fff)",
    borderColor: state.isFocused
      ? "#04A9F5"
      : "var(--bs-border-color, #dee2e6)",
    boxShadow: state.isFocused
      ? "0 0 0 0.2rem rgba(4, 169, 245, 0.25)"
      : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#04A9F5" : "#adb5bd",
    },
    minHeight: "38px",
    borderRadius: "0.375rem",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--bs-body-bg, #fff)",
    border: "1px solid var(--bs-border-color, #dee2e6)",
    borderRadius: "0.375rem",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected
      ? "#04A9F5"
      : state.isFocused
      ? "rgba(4, 169, 245, 0.1)"
      : "var(--bs-body-bg, #fff)",
    color: state.isSelected ? "#fff" : "var(--bs-body-color, #212529)",
    cursor: "pointer",
    padding: "10px 12px",
    "&:active": {
      backgroundColor: "#04A9F5",
      color: "#fff",
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "var(--bs-secondary-color, #6c757d)",
  }),
  input: (styles) => ({
    ...styles,
    color: "var(--bs-body-color, #212529)",
  }),
};
