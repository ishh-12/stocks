import React ,{ useState } from "react";
import Hero from "./Hero";
import CreateTicket from "./CreateTicket";






function SupportPage() {
  //create search state
const [search, setSearch] = useState("");

const supportTopics = [
  "How to open an account",
  "How to add funds",
  "How to withdraw funds",
  "How to place an order",
  "Order rejected reasons",
  "How to check holdings",
  "How to reset password",
  "KYC verification process"
];


//filter topics logic
const filteredTopics = supportTopics.filter((topic) =>
  topic.toLowerCase().includes(search.toLowerCase())
);

//add search input
<input
  type="text"
  placeholder="Search for help..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ padding: "10px", width: "60%", marginBottom: "20px" }}
/>

  return (
    <>
      <Hero />
      <CreateTicket />
      <div className="container p-5 mt-5 mb-5 border-top">
        <h2 className="text-center mb-4">Support Resources</h2>
        <div className="row">
          <div className="col-6">
            <h5 className="text-primary mb-3">Contact Us</h5>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Email Support</td>
                  <td>support@zerodha.com</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>+91 80 4718 8888</td>
                </tr>
                <tr>
                  <td>Trading Hours</td>
                  <td>Mon-Fri: 8:00 AM - 6:00 PM</td>
                </tr>
                <tr>
                  <td>Support Type</td>
                  <td>Email, Phone, Chat</td>
                </tr>
                <tr>
                  <td>Response Time</td>
                  <td>Within 24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h5 className="text-primary mb-3">Common Support Topics</h5>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Account Opening</td>
                  <td>Queries related to new account</td>
                </tr>
                <tr>
                  <td>Trading & Investing</td>
                  <td>Help with placing orders</td>
                </tr>
                <tr>
                  <td>Funds & Banking</td>
                  <td>Deposits, withdrawals, transfers</td>
                </tr>
                <tr>
                  <td>Technology Issues</td>
                  <td>Platform login, app issues</td>
                </tr>
                <tr>
                  <td>Documentation</td>
                  <td>Uploads, verification status</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <h5 className="text-primary mb-3">Frequently Asked Questions</h5>
            <ul style={{ textAlign: "left", lineHeight: "2" }}>
              {/*display results*/}
              {filteredTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
              <li><strong>How do I reset my password?</strong> - Use the "Forgot Password" link on the login page or contact support.</li>
              <li><strong>How do I fund my account?</strong> - Add funds through UPI, net banking, or bank transfer.</li>
              <li><strong>What are the trading hours?</strong> - Equity: 9:15 AM - 3:30 PM, F&O: 9:15 AM - 11:55 PM</li>
              <li><strong>How do I contact customer support?</strong> - Email, phone, or raise a ticket through the support portal.</li>
              <li><strong>Is there a dedicated relationship manager?</strong> - Yes, premium clients get dedicated relationship managers.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupportPage;
