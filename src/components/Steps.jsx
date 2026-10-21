import { money, num } from '../api';

/** "How this was calculated": every number comes from the server's /api/emi/full response. */
export default function Steps({ summary: s, ex, disclaimer }) {
  const f = ex.first, l = ex.last;
  const r = ex.monthlyRate.toFixed(8), g = ex.growthFactor.toFixed(6);
  const Step = ({ no, title, children }) => (
    <div className="step"><div className="no">{no}</div><div><h3 className="h3">{title}</h3>{children}</div></div>
  );
  return (
    <div className="card">
      <div className="formula">EMI = P × r × (1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)</div>
      <p className="small muted center">P = loan amount · r = monthly interest rate · n = number of monthly installments</p>
      <Step no={1} title="Convert the tenure into months">
        <p>EMIs are paid monthly, so n is the total number of months.</p>
        <code className="math">n = {ex.years ? `${ex.tenureValue} years × 12 = ` : ''}{ex.months} months</code>
      </Step>
      <Step no={2} title="Convert the yearly rate into a monthly rate">
        <p>Divide the annual rate by 12 months, then by 100 to turn the percentage into a decimal.</p>
        <code className="math">r = {s.annualRate} ÷ 12 ÷ 100 = {r}</code>
      </Step>
      {ex.zeroInterest ? (
        <Step no={3} title="Zero-interest loan">
          <p>With 0% interest there is nothing to compound, and the formula would divide by zero. So the EMI is simply the loan amount divided by the months.</p>
          <code className="math">{num(s.loanAmount)} ÷ {ex.months} = {money(s.monthlyEmi)}</code>
        </Step>
      ) : (
        <>
          <Step no={3} title="Work out the growth factor (1 + r)ⁿ">
            <p>This shows how much each rupee grows if left unpaid for n months at the monthly rate.</p>
            <code className="math">(1 + {r})^{ex.months} = {g}</code>
          </Step>
          <Step no={4} title="Put the numbers into the formula">
            <code className="math">EMI = {num(s.loanAmount)} × {r} × {g} ÷ ({g} − 1)</code>
            <p>Rounded to 2 decimals, your <b>monthly EMI is {money(s.monthlyEmi)}</b>.</p>
          </Step>
        </>
      )}
      <Step no={5} title="Split the first EMI into interest and principal">
        <p>Each month the interest is charged only on what you still owe. The rest of the EMI reduces the loan.</p>
        <code className="math">Interest = opening balance × r = {num(f.openingBalance)} × {r} = {money(f.interestPaid)}</code>
        <code className="math">Principal = EMI − interest = {num(f.emi)} − {num(f.interestPaid)} = {money(f.principalPaid)}</code>
        <code className="math">New balance = {num(f.openingBalance)} − {num(f.principalPaid)} = {money(f.closingBalance)}</code>
        <p>The new balance becomes next month's opening balance, and the same steps repeat for every installment. Early EMIs are mostly interest; later ones are mostly principal.</p>
      </Step>
      <Step no={6} title="Total interest and total repayment">
        <p>Add up the interest from all {s.tenureMonths} months.</p>
        <code className="math">Total interest = {money(s.totalInterest)}</code>
        <code className="math">Total repayment = principal + interest = {num(s.loanAmount)} + {num(s.totalInterest)} = {money(s.totalPayment)}</code>
      </Step>
      <Step no={7} title="Final installment adjustment">
        <p>Because every amount is rounded to paise, small differences add up. The last installment ({money(l.emi)}) is adjusted to repay exactly what is left, so the closing balance ends at <b>{money(l.closingBalance)}</b>.</p>
        <p className="small muted">{disclaimer}</p>
      </Step>
    </div>
  );
}
