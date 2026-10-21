const CARDS = [
  ['Using the calculator', [
    'Loan amount must be between ₹1,000 and ₹100 crore (1,000,000,000).',
    'Interest rate: 0% to 100% per year. Use the rate on your loan offer letter.',
    'Tenure: 1 month to 40 years (480 months). Pick years or months.',
    'Enter the amount you actually borrow, after your down payment.',
    'At 0% interest the EMI is just the loan amount divided by the months.']],
  ['Understanding your result', [
    'EMI is the fixed amount you pay every month.',
    'Total interest is the extra you pay the lender over the full tenure.',
    'Early EMIs are mostly interest; later EMIs are mostly principal.',
    'Check the schedule to see your balance after any month.',
    'Figures are estimates. Actual bank EMIs may differ because of processing fees, insurance, floating-rate changes and lender-specific rounding.']],
  ['Choosing a tenure', [
    'A longer tenure gives a lower EMI but a much higher total interest.',
    'A shorter tenure gives a higher EMI but saves a lot of interest.',
    'Try a few tenures and compare the total interest, not just the EMI.',
    'A common rule of thumb is to keep all your EMIs under about 40% of your monthly income.']],
  ['Ways to pay less interest', [
    'Compare offers from several lenders. Even 0.5% less on the rate adds up.',
    'Make a larger down payment so you borrow less.',
    'Prepay when you can. Check your lender\'s prepayment charges first.',
    'Look at fees and insurance as well as the rate when comparing loans.']]
];

export default function Guidelines() {
  return (
    <section id="guidelines">
      <h2 className="h2">Guidelines</h2>
      <div className="grid g2">
        {CARDS.map(([title, items]) => (
          <div className="card" key={title}>
            <h3 className="h3">{title}</h3>
            <ul className="list">{items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 14 }}>This calculator is for information only and is not financial advice. Please confirm the final terms with your lender.</p>
    </section>
  );
}
