// Loan eligibility predictor - vanilla JS, rule-based (educational).
const $ = id => document.getElementById(id), money = n => 'Rs. ' + Math.round(n).toLocaleString('en-IN');
const emiFor = (p, annualRate, years) => { const r = annualRate / 1200, n = years * 12; return r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); };
const principalFor = (emi, annualRate, years) => { const r = annualRate / 1200, n = years * 12; return r === 0 ? emi * n : emi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)); };

$('f').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => parseFloat($(id).value), income = v('income'), old = v('emi'), amt = v('amount'), yrs = v('years'), rate = v('rate'), score = v('score');
  if ([income, old, amt, yrs, rate, score].some(isNaN) || income <= 0 || amt <= 0 || score < 300 || score > 900) { $('err').textContent = 'Please fill every field with valid numbers (income and loan amount above 0, credit score 300-900).'; return; }
  $('err').textContent = '';
  const maxBurden = ($('job').value === 'Salaried' ? 0.5 : 0.45) * income;     // allowed total EMI
  const emi = emiFor(amt, rate, yrs), burden = (old + emi) / income * 100;
  const maxLoan = Math.max(0, principalFor(maxBurden - old, rate, yrs));
  const reasons = [];
  if (score < 650) reasons.push('Credit score is below 650.');
  if (old + emi > maxBurden) reasons.push(`Total EMIs would be ${burden.toFixed(0)}% of income. The limit is ${Math.round(maxBurden / income * 100)}%.`);
  const ok = reasons.length === 0, box = $('res');
  box.hidden = false; box.className = 'res ' + (ok ? 'ok' : 'no');
  box.innerHTML = `<h2>${ok ? 'Likely eligible' : 'Not eligible right now'}</h2>
    <div class="nums"><div>New EMI<b>${money(emi)}</b></div><div>Total EMI burden<b>${burden.toFixed(1)}%</b></div><div>Maximum loan you can afford<b>${money(maxLoan)}</b></div></div>
    ${ok ? '<p>Your income, existing EMIs and credit score fit the usual lending rules.</p>' : `<ul>${reasons.map(r => `<li>${r}</li>`).join('')}</ul><p>Try a smaller loan (up to ${money(maxLoan)}), a longer tenure, or improve your credit score.</p>`}`;
});
