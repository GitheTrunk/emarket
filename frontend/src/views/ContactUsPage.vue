<template>
  <div class="contact-page">
    <header class="contact-hero">
      <div class="container">
        <h1>Get in Touch</h1>
        <p>Have questions about our marketplace? We're here to help you succeed.</p>
      </div>
    </header>

    <section class="contact-main">
      <div class="container">
        <div class="contact-wrapper">

          <div class="contact-info">
            <div class="info-card">
              <div class="icon-box"><i class="fas fa-map-marker-alt"></i></div>
              <div class="info-text">
                <h3>Our Office</h3>
                <p>123 Innovation Street, IT Park<br>Phnom Penh, Cambodia</p>
              </div>
            </div>

            <div class="info-card">
              <div class="icon-box"><i class="fas fa-phone-alt"></i></div>
              <div class="info-text">
                <h3>Phone & WhatsApp</h3>
                <p>+855 12 345 678<br>Mon - Fri, 8am - 5pm</p>
              </div>
            </div>

            <div class="info-card">
              <div class="icon-box"><i class="fas fa-envelope"></i></div>
              <div class="info-text">
                <h3>Email Support</h3>
                <p>support@e-market.com<br>info@e-market.com</p>
              </div>
            </div>

            <div class="social-links">
              <a href="#"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-telegram-plane"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div class="contact-form-container">
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" v-model="form.name" placeholder="John Doe" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" v-model="form.email" placeholder="john@example.com" required />
                </div>
                <div class="form-group">
                  <label>Subject</label>
                  <select v-model="form.subject">
                    <option value="general">General Inquiry</option>
                    <option value="seller">Seller Support</option>
                    <option value="buyer">Buyer Support</option>
                    <option value="technical">Technical Issue</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Your Message</label>
                <textarea v-model="form.message" rows="5" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" class="btn btn-submit">
                Send Message <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2>Quick Answers</h2>
          <p>Common questions from our community</p>
        </div>
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <h4><i class="fas fa-question-circle"></i> {{ faq.question }}</h4>
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactUsPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: 'general',
        message: ''
      },
      faqs: [
        {
          question: "How do I become a verified seller?",
          answer: "After registration, upload your business documents in the profile settings. Our team reviews them within 24-48 hours."
        },
        {
          question: "Is there a fee for listing products?",
          answer: "Basic listings are free! We only take a small commission when you successfully complete a trade."
        },
        {
          question: "How does the escrow system work?",
          answer: "We hold the buyer's payment securely and only release it to the seller once the buyer confirms receipt of the goods."
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      alert(`Thank you ${this.form.name}! Your message has been sent.`);
      // Logic to send data to your API would go here
      this.form = { name: '', email: '', subject: 'general', message: '' };
    }
  }
}
</script>

<style scoped>
.contact-page {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

/* Hero Header */
.contact-hero {
  padding: 80px 20px;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #e66e00 0%, #ff7b00 100%);
}

.contact-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
}

/* Main Layout */
.contact-main {
  margin-top: -50px;
  padding-bottom: 80px;
}

.contact-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* Sidebar Info */
.contact-info {
  background: #1e293b;
  color: white;
  padding: 50px;
}

.info-card {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.icon-box {
  width: 50px;
  height: 50px;
  background: rgba(255, 123, 0, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff7b00;
  font-size: 1.2rem;
}

.info-text h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.info-text p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 50px;
}

.social-links a {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: 0.3s;
}

.social-links a:hover {
  background: #ff7b00;
  transform: translateY(-3px);
}

/* Form Styles */
.contact-form-container {
  padding: 50px;
}

.form-group {
  margin-bottom: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  transition: 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #ff7b00;
  box-shadow: 0 0 0 3px rgba(255, 123, 0, 0.1);
}

.btn-submit {
  background: #ff7b00;
  color: white;
  padding: 14px 30px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
}

.btn-submit:hover {
  background: #e66e00;
  transform: translateY(-2px);
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #1e293b;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.faq-item {
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
}

.faq-item h4 {
  color: #ff7b00;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.faq-item p {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 992px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
  }
  .contact-info {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-form-container {
    padding: 30px;
  }
}
</style>