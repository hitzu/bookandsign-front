# TODO: Expo Bebé — API Integrations

The `/expo-bebe` page currently uses hardcoded mock data for the Contratos tab. The following real API calls need to be implemented when the backend is ready.

---

## Contract Tab — Pending Integrations

### 1. Load brands (for product selector)

- Replace `UI_PACKAGES` constant
- Call: `getBrands()` → populate brand dropdown
- Then: `getPackages(brandId)` → populate package dropdown per brand

### 2. Load vendors

- Replace `UI_VENDORS` constant
- Call: `getUsers({ role: 'vendor' })` or equivalent → populate vendedor select

### 3. Load payment methods

- Replace `UI_FORMAS_PAGO` constant
- Call: API endpoint TBD → populate forma de pago select

### 4. Hold a slot

- When the user picks a date/slot in the Contratos tab
- Call: `holdSlot(slotId, sessionMinutes)` → reserve with timeout
- Display countdown if slot has a hold timer

### 5. Generate contract

- On form submit
- Call: `generateContract({ clientName, clientEmail, clientPhone, slotId, packageId, extras, paymentMethod, downPayment, notes })`
- Display contract preview or download link on success

### 6. Create payment record

- After contract is generated
- Call: `createPayment({ contractId, amount, method, reference })`

### 7. Create note

- If notes field is filled
- Call: `createNote({ contractId, content })`

---

## Calendar Tab — Already Connected

- `getSlotsByMonthAndYear(month, year)` — real API, no changes needed

---

## Services Tab — Hardcoded (by design)

- `SERVICES` and `EXTRAS` arrays are intentionally hardcoded for now
- Update when content management is added

---
