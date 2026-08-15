const modules = [
  { id: "health", icon: "✚", name: "Health Micro-Cover", price: 500, description: "Outpatient care + hospital cash" },
  { id: "gadget", icon: "▣", name: "Gadget & Device Protect", price: 1200, description: "Theft, damage & liquid damage" },
  { id: "income", icon: "↗", name: "Income Shield", price: 1500, description: "Short-term income replacement" },
  { id: "cyber", icon: "⌁", name: "Cyber & Data Guard", price: 800, description: "Fraud reimbursement + identity support" },
];

const STORAGE_KEY = "pulse-cover-demo-state";
const defaultTransactions = [
  { icon: "🛒", title: "Jumia checkout", meta: "Today, 11:20am · Card", amount: -24800 },
  { icon: "⚡", title: "Electricity — Ikeja Disco", meta: "Yesterday · Wallet", amount: -8500 },
  { icon: "♢", title: "Pulse Cover premium", meta: "14 Aug 2026 · Subscription", amount: -1200 },
  { icon: "↗", title: "Payment from Chidi", meta: "12 Aug 2026 · Transfer", amount: 45000 },
];
const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
const state = {
  screen: "home",
  selected: ["gadget"],
  balance: 184250,
  cardFrozen: false,
  notifications: true,
  uploaded: false,
  claimSubmitted: false,
  transactions: defaultTransactions,
  claims: [],
  ...storedState,
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const naira = (value) => `₦${value.toLocaleString("en-NG")}`;

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, screen: "home", uploaded: false }));
}

function addTransaction(transaction) {
  state.transactions = [{ ...transaction, createdAt: Date.now() }, ...state.transactions];
  persist();
}

function transactionAmount(amount) {
  return `${amount >= 0 ? "+" : "−"}${naira(Math.abs(amount))}`;
}

function transactionMarkup(transaction) {
  const amountLabel = transaction.amount === 0 ? "Logged" : transactionAmount(transaction.amount);
  return `<div class="transaction" data-search-item><span class="transaction-icon">${transaction.icon}</span><div class="transaction-info"><strong>${transaction.title}</strong><small>${transaction.meta}</small></div><b class="${transaction.amount >= 0 ? "positive" : ""}">${amountLabel}</b></div>`;
}

function total() {
  return modules.filter((item) => state.selected.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
}

function navigate(screen) {
  state.screen = screen;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function toggleModule(id) {
  state.selected = state.selected.includes(id) ? state.selected.filter((item) => item !== id) : [...state.selected, id];
  persist();
  render();
}

function bindInteractions() {
  document.querySelectorAll("[data-screen]").forEach((element) => {
    element.onclick = () => navigate(element.dataset.screen);
  });
  document.querySelectorAll("[data-module]").forEach((element) => {
    element.onclick = () => toggleModule(element.dataset.module);
  });
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.onclick = () => actions[element.dataset.action]?.();
  });
  document.querySelector("#claim-form")?.addEventListener("submit", actions.submitClaim);
  document.querySelector("#transfer-form")?.addEventListener("submit", actions.transfer);
  document.querySelector("#airtime-form")?.addEventListener("submit", actions.airtime);
  document.querySelector("#bill-form")?.addEventListener("submit", actions.bill);
  document.querySelector("#upload")?.addEventListener("click", actions.upload);
  document.querySelector("#search-input")?.addEventListener("input", (event) => {
    document.querySelectorAll("[data-search-item]").forEach((item) => {
      item.hidden = !item.textContent.toLowerCase().includes(event.target.value.toLowerCase());
    });
  });
}

const actions = {
  toggleCard() {
    state.cardFrozen = !state.cardFrozen;
    persist();
    render();
    showToast(state.cardFrozen ? "Card frozen" : "Card is active again");
  },
  toggleNotifications() {
    state.notifications = !state.notifications;
    persist();
    render();
    showToast(state.notifications ? "Notifications turned on" : "Notifications muted");
  },
  upload() {
    state.uploaded = true;
    document.querySelector("#upload").innerHTML = "<div><strong>✓ Damage photo attached</strong>IMG_2026_0814.jpg · ready to submit</div>";
    showToast("Photo attached to your claim");
  },
  submitClaim(event) {
    event.preventDefault();
    state.claimSubmitted = true;
    const form = new FormData(event.target);
    const claim = { id: `PC-${String(Date.now()).slice(-5)}`, type: form.get("type"), date: form.get("date"), description: form.get("description"), status: "Under review", createdAt: Date.now() };
    state.claims = [claim, ...state.claims];
    addTransaction({ icon: "↗", title: `${claim.type} claim submitted`, meta: `Just now · ${claim.id}`, amount: 0 });
    persist();
    navigate("claim-status");
  },
  transfer(event) {
    event.preventDefault();
    const amount = Number(document.querySelector("#transfer-amount").value || 0);
    if (!amount || amount > state.balance) return showToast("Enter a valid amount");
    const recipient = document.querySelector("#recipient").value.trim() || "recipient";
    state.balance -= amount;
    addTransaction({ icon: "↗", title: `Transfer to ${recipient}`, meta: "Just now · Transfer", amount: -amount });
    persist();
    navigate("home");
    showToast(`${naira(amount)} transfer scheduled`);
  },
  airtime(event) {
    event.preventDefault();
    const amount = Number(document.querySelector("#airtime-amount").value || 0);
    if (!amount || amount > state.balance) return showToast("Enter a valid amount");
    state.balance -= amount;
    addTransaction({ icon: "▣", title: "Airtime purchase", meta: "Just now · MTN", amount: -amount });
    persist();
    navigate("home");
    showToast("Airtime purchase successful");
  },
  bill(event) {
    event.preventDefault();
    const amount = Number(document.querySelector("#bill-amount").value || 0);
    if (!amount || amount > state.balance) return showToast("Enter a valid amount");
    state.balance -= amount;
    addTransaction({ icon: "⚡", title: "Electricity bill", meta: "Just now · Ikeja Disco", amount: -amount });
    persist();
    navigate("home");
    showToast("Bill payment successful");
  },
};

function navItem(screen, icon, label) {
  const active = state.screen === screen;
  return `<button class="nav-item ${active ? "active" : ""}" data-screen="${screen}"><span>${icon}</span><small>${label}</small></button>`;
}

const screens = {
  home: () => `<div class="top-row"><div><p class="eyebrow">Good afternoon</p><h1>Adeola 👋</h1></div><button class="avatar" data-screen="more">A</button></div>
    <section class="balance-card"><div class="balance-label">WALLET BALANCE</div><div class="balance">${naira(state.balance)}.00</div><div class="balance-foot"><span class="pulse"></span> Your money is safe and ready</div></section>
    <div class="section-title">Quick actions</div><div class="quick-actions"><button class="quick-action" data-screen="transfer"><span class="quick-icon">💸</span><span>Transfer</span></button><button class="quick-action" data-screen="airtime"><span class="quick-icon">▣</span><span>Airtime</span></button><button class="quick-action" data-screen="bills"><span class="quick-icon">💡</span><span>Bills</span></button><button class="quick-action insurance" data-screen="insurance"><span class="quick-icon">♢</span><span>Insurance</span></button></div>
    <div class="section-title row"><span>Recent activity</span><button class="text-btn" data-screen="activity">See all</button></div><div class="transactions">${state.transactions.slice(0, 3).map(transactionMarkup).join("")}</div>
    <div class="section-title">Your protection</div><button class="policy-card clickable" data-screen="insurance"><span class="policy-icon">♢</span><div class="policy-copy"><strong>Pulse Cover insurance</strong><small>${state.selected.length} active cover${state.selected.length === 1 ? "" : "s"} · next payment ${naira(total())}</small></div><span class="arrow">›</span></button>`,

  transfer: () => `<button class="back" data-screen="home">← Back</button><p class="eyebrow">Move money</p><h2>Send money</h2><p class="subhead">Transfer to a friend, family member or bank account.</p><form id="transfer-form"><div class="form-field"><label for="recipient">Recipient</label><input id="recipient" placeholder="Name or account number" required /></div><div class="form-field"><label for="transfer-amount">Amount</label><input id="transfer-amount" type="number" min="100" placeholder="₦0.00" required /></div><div class="recipient-row"><span class="avatar small">TO</span><div><strong>Fast transfer</strong><small>Usually arrives instantly</small></div><span class="badge">Verified</span></div><button class="primary-btn" type="submit">Review transfer</button></form>`,

  airtime: () => `<button class="back" data-screen="home">← Back</button><p class="eyebrow">Stay connected</p><h2>Buy airtime</h2><p class="subhead">Top up any Nigerian network in seconds.</p><form id="airtime-form"><div class="network-grid"><button type="button" class="network active">MTN</button><button type="button" class="network">Airtel</button><button type="button" class="network">Glo</button><button type="button" class="network">9mobile</button></div><div class="form-field"><label for="phone">Phone number</label><input id="phone" value="0803 456 7890" required /></div><div class="form-field"><label for="airtime-amount">Amount</label><input id="airtime-amount" type="number" value="2000" required /></div><button class="primary-btn" type="submit">Buy airtime</button></form>`,

  bills: () => `<button class="back" data-screen="home">← Back</button><p class="eyebrow">Pay with ease</p><h2>Pay a bill</h2><p class="subhead">Keep your essentials running without leaving the app.</p><div class="bill-grid"><button class="bill-option active"><span>⚡</span>Electricity</button><button class="bill-option"><span>◉</span>Internet</button><button class="bill-option"><span>▣</span>TV</button><button class="bill-option"><span>＋</span>More</button></div><form id="bill-form"><div class="form-field"><label for="meter">Meter or account number</label><input id="meter" placeholder="Enter number" required /></div><div class="form-field"><label for="bill-amount">Amount</label><input id="bill-amount" type="number" placeholder="₦0.00" required /></div><button class="primary-btn" type="submit">Continue to payment</button></form>`,

  activity: () => `<button class="back" data-screen="home">← Back</button><div class="row"><div><p class="eyebrow">Your money</p><h2>Activity</h2></div><span class="badge">August 2026</span></div><div class="search-box">⌕<input id="search-input" placeholder="Search transactions" /></div><div class="transactions activity-list">${state.transactions.map(transactionMarkup).join("")}</div>`,

  insurance: () => `<button class="back" data-screen="home">← Back</button><p class="eyebrow">Powered by Pulse Cover</p><h2>My Insurance</h2><p class="subhead">Simple cover for the things that keep your digital life moving.</p><div class="insurance-hero"><div><span class="badge light">ACTIVE POLICY</span><h3>Gadget & Device Protect</h3><p>Protection for your laptop and phone</p></div><span class="hero-check">✓</span></div><div class="stat-grid"><div><strong>${naira(total())}</strong><small>Monthly premium</small></div><div><strong>14 Sep</strong><small>Next renewal</small></div></div><div class="section-title">Manage</div><button class="policy-card clickable" data-screen="choose"><span class="policy-icon">▤</span><div class="policy-copy"><strong>Build your cover</strong><small>Add or remove modules anytime</small></div><span class="arrow">›</span></button><button class="policy-card clickable" data-screen="claims"><span class="policy-icon">↗</span><div class="policy-copy"><strong>Claims & support</strong><small>${state.claims.length ? `${state.claims.length} claim${state.claims.length === 1 ? "" : "s"} under review` : "Start a claim in a few taps"}</small></div><span class="arrow">›</span></button><button class="secondary-btn" data-action="pause">Pause my cover</button>`,

  choose: () => `<button class="back" data-screen="insurance">← Back</button><p class="eyebrow">Step 2 · Choose</p><h2>Build your cover</h2><p class="subhead">Toggle on only what you need. Pause or cancel anytime.</p>${modules.map((item) => `<div class="module-card ${state.selected.includes(item.id) ? "selected" : ""}" data-module="${item.id}"><label><input type="checkbox" ${state.selected.includes(item.id) ? "checked" : ""} /><span class="policy-icon">${item.icon}</span><span class="module-copy"><strong>${item.name}</strong><small>${item.description}</small></span><span class="price">${naira(item.price)}<small>/mo</small></span></label></div>`).join("")}<div class="total-bar"><span><small>MONTHLY TOTAL</small><strong>${naira(total())}</strong></span><span>✓ Flexible</span></div><button class="primary-btn" data-action="save-cover">Save cover</button>`,

  claims: () => `<button class="back" data-screen="insurance">← Back</button><div class="row"><div><p class="eyebrow">Claims centre</p><h2>Claims & support</h2></div><span class="help-icon">?</span></div><p class="subhead">Transparent updates from first report to wallet payout.</p>${state.claims.length ? state.claims.map((claim) => `<div class="claim-summary"><div class="row"><strong>${claim.type}</strong><span class="badge amber">${claim.status}</span></div><small>Claim #${claim.id} · ${claim.date}</small><p>${claim.description}</p></div>`).join("") : `<div class="empty-state"><span class="policy-icon">↗</span><strong>No claims yet</strong><small>Your submitted claims will appear here.</small></div>`}<button class="policy-card clickable" data-screen="claim"><span class="policy-icon">＋</span><div class="policy-copy"><strong>Start a new claim</strong><small>Photo evidence makes review faster</small></div><span class="arrow">›</span></button><div class="info-card"><strong>Need help?</strong><p>Chat with our support team about a policy, payment or claim.</p><button class="text-btn" data-action="chat">Open chat →</button></div>`,

  claim: () => `<button class="back" data-screen="claims">← Back</button><p class="eyebrow">Step 3 · File</p><h2>Start a claim</h2><p class="subhead">Gadget & Device Protect · Policy #PC-44192</p><form id="claim-form"><div class="form-field"><label for="type">Incident type</label><input id="type" name="type" value="Collision damage" required /></div><div class="form-field"><label for="date">Date of incident</label><input id="date" name="date" value="14 Aug 2026" required /></div><div class="form-field"><label for="description">Description</label><textarea id="description" name="description" placeholder="Briefly describe what happened..." required>My laptop was damaged while travelling to a client meeting.</textarea></div><div class="form-field"><label>Evidence</label><button type="button" class="upload" id="upload">📷<div><strong>Upload photos</strong>Damage evidence, police report</div></button></div><button class="primary-btn" type="submit">Submit claim</button></form>`,

  "claim-status": () => `<div class="success"><div class="success-mark">✓</div><p class="eyebrow">Claim received</p><h2>You’re covered, Adeola</h2><p>Your claim has been saved to this device and sent for review. We’ll keep you updated in the app.</p><div class="claim-summary"><div class="row"><span class="eyebrow">CLAIM REFERENCE</span><strong>#${state.claims[0]?.id || "PC-00000"}</strong></div><div class="row" style="margin-top:12px"><span class="eyebrow">ESTIMATED REVIEW</span><strong>Within 48 hours</strong></div></div><div class="timeline"><div class="timeline-item"><span class="dot"></span><div><strong>Claim submitted</strong><small>Just now · Evidence attached</small></div></div><div class="timeline-item"><span class="dot"></span><div><strong>Pulse Cover review</strong><small>Next · We’ll verify your evidence</small></div></div><div class="timeline-item"><span class="dot" style="background:#dce8e1"></span><div><strong>Wallet payout</strong><small>Approved claims go straight to your wallet</small></div></div></div><button class="primary-btn" data-screen="claims">View claims centre</button></div>`,

  cards: () => `<button class="back" data-screen="home">← Back</button><div class="row"><div><p class="eyebrow">Spend securely</p><h2>Your cards</h2></div><button class="help-icon" data-action="add-card">＋</button></div><p class="subhead">Manage cards and payment methods connected to Pulse Cover.</p><div class="virtual-card ${state.cardFrozen ? "frozen" : ""}"><div class="row"><span>PULSE COVER</span><span>${state.cardFrozen ? "FROZEN" : "VIRTUAL CARD"}</span></div><div class="card-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 4092</div><div class="row"><span>ADEOLA O.</span><span>09/28</span></div></div><div class="card-actions"><button data-action="toggleCard"><span>${state.cardFrozen ? "🔓" : "🔒"}</span>${state.cardFrozen ? "Unfreeze card" : "Freeze card"}</button><button data-action="card-details"><span>⌁</span>Card details</button></div><div class="section-title">Connected wallets</div><button class="policy-card"><span class="policy-icon">₦</span><div class="policy-copy"><strong>Pulse Cover wallet</strong><small>Primary payment method</small></div><span class="badge">Active</span></button>`,

  pay: () => `<button class="back" data-screen="home">← Back</button><p class="eyebrow">Money movement</p><h2>Pay & transfer</h2><p class="subhead">Move money, pay bills and keep your subscriptions running.</p><button class="feature-row" data-screen="transfer"><span class="feature-icon green">⇄</span><span><strong>Send money</strong><small>To a bank account or friend</small></span><span>›</span></button><button class="feature-row" data-screen="airtime"><span class="feature-icon amber">▣</span><span><strong>Buy airtime</strong><small>Top up any network</small></span><span>›</span></button><button class="feature-row" data-screen="bills"><span class="feature-icon blue">⚡</span><span><strong>Pay a bill</strong><small>Electricity, TV and internet</small></span><span>›</span></button>`,

  more: () => `<button class="back" data-screen="home">← Back</button><div class="profile-head"><div class="avatar large">A</div><div><h2>Adeola Okafor</h2><p>adeola@email.com</p></div><span class="badge">Verified</span></div><div class="section-title">Account</div><button class="feature-row" data-action="notifications"><span class="feature-icon green">⌁</span><span><strong>Notifications</strong><small>${state.notifications ? "Push alerts are on" : "Muted for now"}</small></span><span class="toggle ${state.notifications ? "on" : ""}"></span></button><button class="feature-row" data-action="security"><span class="feature-icon blue">♢</span><span><strong>Security & privacy</strong><small>Passcode, biometrics and devices</small></span><span>›</span></button><button class="feature-row" data-action="help"><span class="feature-icon amber">?</span><span><strong>Help centre</strong><small>Answers, support and feedback</small></span><span>›</span></button><div class="info-card demo-note"><strong>Pulse Cover demo mode</strong><p>This prototype persists payments, cover changes and claims in your browser so you can explore the customer experience safely.</p></div><button class="secondary-btn" data-action="logout">Sign out</button>`,
};

actions.pause = () => showToast("Cover paused until you turn it back on");
actions.saveCover = () => { navigate("insurance"); showToast("Your cover has been updated"); };
actions.chat = () => showToast("Support chat opened");
actions.notifications = actions.toggleNotifications;
actions.security = () => showToast("Security centre opened");
actions.help = () => showToast("Help centre opened");
actions.addCard = () => showToast("Card setup is ready");
actions.cardDetails = () => showToast("Card details are protected");
actions.logout = () => showToast("Demo sign-out complete");

function render() {
  app.innerHTML = screens[state.screen]();
  bindInteractions();
  document.querySelector(".bottom-nav").innerHTML = `${navItem("home", "⌂", "Home")}${navItem("pay", "⇄", "Pay")}${navItem("cards", "▣", "Cards")}${navItem("more", "⋯", "More")}`;
  document.querySelectorAll(".bottom-nav [data-screen]").forEach((element) => { element.onclick = () => navigate(element.dataset.screen); });
}

render();
