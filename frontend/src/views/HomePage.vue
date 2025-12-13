<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Connect, Trade, Succeed</h1>
          <p class="hero-subtitle">
            The Ultimate Marketplace Connecting Sellers with Serious Buyers. Start Your Business
            Journey Today.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" @click="navigateToRegister('seller')">
              <i class="fas fa-store"></i> Start Selling
            </button>
            <button class="btn btn-secondary" @click="navigateToRegister('buyer')">
              <i class="fas fa-shopping-cart"></i> Start Buying
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">{{ formatNumber(stats.activeSellers) }}+</span>
              <span class="stat-label">Active Sellers</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ formatNumber(stats.activeBuyers) }}+</span>
              <span class="stat-label">Verified Buyers</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ formatNumber(stats.totalTransactions) }}+</span>
              <span class="stat-label">Successful Trades</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/img.png" alt="Marketplace Illustration" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Why Choose Our Platform</h2>
          <p>Designed for seamless buyer-seller interactions</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon" :style="{ backgroundColor: feature.color }">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to start trading</p>
        </div>
        <div class="steps">
          <div class="step" v-for="(step, index) in steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-arrow" v-if="index < steps.length - 1">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2>Popular Categories</h2>
          <p>Browse products by category</p>
        </div>
        <div class="categories-grid">
          <div
            class="category-card"
            v-for="category in categories"
            :key="category.id"
            @click="browseCategory(category.id)"
          >
            <div class="category-icon" :style="{ backgroundColor: category.color }">
              <i :class="category.icon"></i>
            </div>
            <h3>{{ category.name }}</h3>
            <span class="category-count">{{ category.count }} listings</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Sellers & Buyers -->
    <section class="users-section">
      <div class="container">
        <div class="tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'sellers' }"
            @click="activeTab = 'sellers'"
          >
            <i class="fas fa-store"></i> Featured Sellers
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'buyers' }"
            @click="activeTab = 'buyers'"
          >
            <i class="fas fa-users"></i> Verified Buyers
          </button>
        </div>

        <div class="users-grid" v-if="activeTab === 'sellers'">
          <div class="user-card" v-for="seller in featuredSellers" :key="seller.id">
            <div class="user-avatar">
              <img :src="seller.avatar" :alt="seller.name" />
              <span class="verified-badge" v-if="seller.verified">
                <i class="fas fa-check-circle"></i>
              </span>
            </div>
            <h4>{{ seller.name }}</h4>
            <p class="user-category">{{ seller.category }}</p>
            <div class="user-rating">
              <i
                class="fas fa-star"
                v-for="n in 5"
                :key="n"
                :class="{ filled: n <= seller.rating }"
              ></i>
              <span class="rating-value">{{ seller.rating.toFixed(1) }}</span>
            </div>
            <p class="user-stats">{{ seller.listings }} listings</p>
            <button class="btn btn-outline" @click="viewSellerProfile(seller.id)">
              View Profile
            </button>
          </div>
        </div>

        <div class="users-grid" v-else>
          <div class="user-card" v-for="buyer in featuredBuyers" :key="buyer.id">
            <div class="user-avatar">
              <img :src="buyer.avatar" :alt="buyer.name" />
              <span class="verified-badge" v-if="buyer.verified">
                <i class="fas fa-check-circle"></i>
              </span>
            </div>
            <h4>{{ buyer.name }}</h4>
            <p class="user-category">{{ buyer.interest }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <i class="fas fa-shopping-bag"></i>
                <span>{{ buyer.purchases }} purchases</span>
              </div>
            </div>
            <button class="btn btn-outline" @click="viewBuyerProfile(buyer.id)">Connect</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>Success Stories</h2>
          <p>What our users say about us</p>
        </div>
        <div class="testimonials">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" />
              <div>
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of successful sellers and buyers on our platform</p>
          <div class="cta-actions">
            <button class="btn btn-light" @click="navigateToRegister('seller')">
              Register as Seller
            </button>
            <button class="btn btn-dark" @click="navigateToRegister('buyer')">
              Register as Buyer
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      activeTab: 'sellers',
      stats: {
        activeSellers: 12500,
        activeBuyers: 85000,
        totalTransactions: 450000,
      },
      features: [
        {
          id: 1,
          icon: 'fas fa-shield-alt',
          title: 'Secure Transactions',
          description: 'Escrow payment protection and secure messaging',
          color: '#4CAF50',
        },
        {
          id: 2,
          icon: 'fas fa-search',
          title: 'Smart Matching',
          description: 'AI-powered matching of buyers with relevant sellers',
          color: '#2196F3',
        },
        {
          id: 3,
          icon: 'fas fa-chart-line',
          title: 'Analytics Dashboard',
          description: 'Track sales, leads, and performance metrics',
          color: '#FF9800',
        },
        {
          id: 4,
          icon: 'fas fa-comments',
          title: 'Direct Messaging',
          description: 'Built-in chat for seamless communication',
          color: '#9C27B0',
        },
        {
          id: 5,
          icon: 'fas fa-star',
          title: 'Rating System',
          description: 'Verified reviews and ratings for trust',
          color: '#FF5722',
        },
        {
          id: 6,
          icon: 'fas fa-mobile-alt',
          title: 'Mobile Friendly',
          description: 'Access marketplace on any device',
          color: '#00BCD4',
        },
      ],
      steps: [
        {
          title: 'Create Account',
          description: 'Sign up as a seller or buyer in minutes',
        },
        {
          title: 'Set Up Profile',
          description: 'Add details about your business or needs',
        },
        {
          title: 'Browse & Connect',
          description: 'Find relevant partners and start conversations',
        },
        {
          title: 'Start Trading',
          description: 'Make secure transactions with our protection',
        },
      ],
      categories: [
        { id: 1, name: 'Electronics', icon: 'fas fa-laptop', count: 12500, color: '#4ECDC4' },
        { id: 2, name: 'Fashion', icon: 'fas fa-tshirt', count: 8900, color: '#FF6B6B' },
        { id: 3, name: 'Home & Garden', icon: 'fas fa-home', count: 7400, color: '#FFD166' },
        { id: 4, name: 'Automotive', icon: 'fas fa-car', count: 5600, color: '#06D6A0' },
        { id: 5, name: 'Beauty', icon: 'fas fa-spa', count: 4300, color: '#118AB2' },
        { id: 6, name: 'Sports', icon: 'fas fa-football-ball', count: 3200, color: '#EF476F' },
      ],
      featuredSellers: [
        {
          id: 1,
          name: 'TechGadgets Inc.',
          category: 'Electronics',
          rating: 4.8,
          listings: 245,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
          id: 2,
          name: 'FashionHub',
          category: 'Clothing',
          rating: 4.9,
          listings: 189,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        {
          id: 3,
          name: 'HomeEssentials',
          category: 'Home Goods',
          rating: 4.7,
          listings: 156,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
        {
          id: 4,
          name: 'AutoParts Pro',
          category: 'Automotive',
          rating: 4.6,
          listings: 98,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=4',
        },
      ],
      featuredBuyers: [
        {
          id: 1,
          name: 'John Enterprises',
          interest: 'Bulk Electronics',
          purchases: 245,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
          id: 2,
          name: 'Retail Chain Co.',
          interest: 'Fashion Wholesale',
          purchases: 189,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=6',
        },
        {
          id: 3,
          name: 'Hotel Group',
          interest: 'Hospitality Supplies',
          purchases: 156,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=7',
        },
        {
          id: 4,
          name: 'University Dept.',
          interest: 'Educational Materials',
          purchases: 98,
          verified: true,
          avatar: 'https://i.pravatar.cc/150?img=8',
        },
      ],
      testimonials: [
        {
          id: 1,
          content: 'This platform revolutionized my small business. Found reliable buyers in days!',
          name: 'Sarah Chen',
          role: 'Fashion Seller',
          avatar: 'https://i.pravatar.cc/150?img=9',
        },
        {
          id: 2,
          content:
            'As a buyer, I love the variety and quality of sellers. Saved 30% on procurement!',
          name: 'Michael Rodriguez',
          role: 'Procurement Manager',
          avatar: 'https://i.pravatar.cc/150?img=10',
        },
        {
          id: 3,
          content: 'The secure payment system gives me peace of mind for large transactions.',
          name: 'Emma Wilson',
          role: 'Electronics Wholesaler',
          avatar: 'https://i.pravatar.cc/150?img=11',
        },
      ],
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    },
    navigateToRegister(type) {
      this.$router.push(`/register?type=${type}`)
    },
    browseCategory(categoryId) {
      this.$router.push(`/category/${categoryId}`)
    },
    viewSellerProfile(sellerId) {
      this.$router.push(`/seller/${sellerId}`)
    },
    viewBuyerProfile(buyerId) {
      this.$router.push(`/buyer/${buyerId}`)
    },
  },
}
</script>

<style scoped>

.homepage {
  width: 100%;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00, #ffffff);
  color: white;
  padding: 80px 20px;
}

.hero-content {
  max-width: 1200px;
  //margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.btn {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: white;
  color: #ff7b00;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Common Section Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.section-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

/* Features Section */
.features-section {
  padding: 100px 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
}

.feature-icon i {
  font-size: 32px;
  color: white;
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

/* How It Works */
.how-it-works {
  padding: 100px 0;
  background: white;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  position: relative;
}

.step {
  position: relative;
  text-align: center;
  padding: 30px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
}

.step-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.step-content p {
  color: #64748b;
}

.step-arrow {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e1;
  font-size: 1.5rem;
}

/* Categories Section */
.categories-section {
  padding: 100px 0;
  background: #f8fafc;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.category-icon i {
  font-size: 28px;
  color: white;
}

.category-card h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #2c3e50;
}

.category-count {
  font-size: 0.9rem;
  color: #64748b;
}

/* Users Section */
.users-section {
  padding: 100px 0;
  background: white;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
}

.tab-btn {
  padding: 12px 30px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab-btn:hover {
  border-color: #ff7b00;
  color: #ff7b00;
}

.tab-btn.active {
  background: #ff7b00;
  color: white;
  border-color: #ff7b00;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.user-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
}

.user-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  border-radius: 50%;
  padding: 5px;
}

.verified-badge i {
  color: #ff7b00;
  font-size: 1.2rem;
}

.user-card h4 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.user-category {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.user-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
}

.user-rating i {
  color: #e2e8f0;
}

.user-rating i.filled {
  color: #ffd700;
}

.rating-value {
  margin-left: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.user-stats {
  color: #64748b;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
}

.btn-outline {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 10px 24px;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

/* Testimonials */
.testimonials-section {
  padding: 100px 0;
  background: #f8fafc;
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.testimonial-content {
  font-style: italic;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 30px;
  position: relative;
}

.testimonial-content::before {
  content: '"';
  font-size: 4rem;
  color: #e2e8f0;
  position: absolute;
  top: -20px;
  left: -10px;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.testimonial-author img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-author h4 {
  margin: 0;
  color: #2c3e50;
}

.testimonial-author p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-light {
  background: white;
  color: #2c3e50;
}

.btn-dark {
  background: #667eea;
  color: white;
}

.btn-light:hover,
.btn-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .step-arrow {
    display: none;
  }

  .hero-title {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 15px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .tabs {
    flex-direction: column;
  }

  .section-header h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>