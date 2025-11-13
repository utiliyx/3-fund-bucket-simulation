*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
  background: #f5f5f7;
  color: #111827;
}

.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 1.9rem;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
}

main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 0.85rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

h3 {
  margin: 0.75rem 0 0.4rem;
  font-size: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.9rem;
  color: #374151;
}

input,
select {
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #f9fafb;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.primary-btn {
  margin-top: 0.5rem;
  align-self: flex-start;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  background: #111827;
  color: #f9fafb;
  transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease;
}

.primary-btn:hover {
  opacity: 0.9;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.results {
  font-size: 0.9rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.result-block {
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.result-block h3 {
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.result-block p {
  margin: 0.15rem 0;
}

.result-label {
  color: #6b7280;
  font-size: 0.85rem;
}

.result-value {
  font-weight: 600;
}

.section-title {
  margin-top: 0.5rem;
  margin-bottom: 0.15rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.trade-list {
  margin: 0.3rem 0 0;
  padding-left: 1.1rem;
}

.trade-list li {
  margin: 0.15rem 0;
}

.muted {
  color: #9ca3af;
}

.warnings {
  margin-bottom: 0.5rem;
}

.warning {
  padding: 0.45rem 0.7rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
}

footer {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.hidden {
  display: none;
}

.divider {
  margin: 0.75rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 900px) {
  main {
    grid-template-columns: minmax(0, 1fr);
  }
}
