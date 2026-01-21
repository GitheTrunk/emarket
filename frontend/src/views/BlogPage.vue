<template>

  <div class="blog-page">

    <!--blog hero-->
    <header class="blog-hero">
      <div class="container">
        <span class="badge">E-Market Insights</span>
        <h1>Our Stories & Updates</h1>
        <p>Advice for sellers and the latest trends for buyers.</p>
      </div>
    </header>


    <!--blog catergories-->
    <section class="filter-section">
      <div class="container">
        <div class="categories-tabs">
          <button
              v-for="cat in categories"
              :key="cat"
              :class="['tab-btn', { active: activeCategory === cat }]"
              @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>


    <!--blog content-->
    <section class="blog-content">
      <div class="container">
        <div class="blog-grid">
          <article
              v-for="post in filteredPosts"
              :key="post.id"
              class="blog-card"
          >
            <div class="card-image">
              <img :src="post.image" :alt="post.title" />
              <span class="post-category">{{ post.category }}</span>
            </div>

            <div class="card-body">
              <div class="post-meta">
                <span><i class="far fa-calendar"></i> {{ post.date }}</span>
                <span><i class="far fa-user"></i> {{ post.author }}</span>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>

              <div class="post-full-content">
                <p v-for="(paragraph, index) in post.content" :key="index">
                  {{ paragraph }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>


    <!--if user wants to see our updates-->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-card">
          <h2>Never Miss an Update</h2>
          <p>Subscribe to our newsletter and get the best market tips delivered to your inbox.</p>
          <div class="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button class="btn btn-dark">Subscribe Now</button>
          </div>
        </div>
      </div>
    </section>


  </div>

</template>

<script>
export default {

  name: 'BlogPage',
  data() {
    return {
      activeCategory: 'All',
      categories: ['All', 'Selling Tips', 'Buying Guide', 'Success Stories', 'Updates'],
      posts: [
        {
          id: 1,
          title: 'How to Scale Your Student Project into a Business',
          category: 'Success Stories',
          date: 'Jan 10, 2026',
          author: 'Team E-Market',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500',
          content: [
            "The journey from a classroom group project to a global marketplace is challenging but rewarding. It starts with identifying a real-world problem that your fellow students face every day.",
            "Scaling requires shifting your mindset from 'completing an assignment' to 'building a sustainable ecosystem.' This involves setting up secure payment gateways and verifying users.",
            "In our experience, the most important step is listening to user feedback. Start small, iterate fast, and never lose sight of the convenience you are providing."
          ]
        },
        {
          id: 2,
          title: '5 Tips for Secure Online Transactions',
          category: 'Buying Guide',
          date: 'Jan 08, 2026',
          author: 'Security Team',
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500',
          content: [
            "Ensuring your safety while shopping online is our top priority. First, always check for the padlock icon in your browser address bar.",
            "Second, never share your password or OTP with anyone, even if they claim to be from our support team.",
            "Lastly, use our built-in secure messaging system to communicate with sellers. Keeping transactions on-platform ensures you are protected by our escrow service."
          ]
        },
        {
          id: 3,
          title: 'Optimizing Product Listings for Better Sales',
          category: 'Selling Tips',
          date: 'Jan 05, 2026',
          author: 'Marketing Pro',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500',
          content: [
            "High-quality images and clear descriptions are the secret weapons of top sellers on our platform. A bright, clear photo can increase clicks by 40%.",
            "Be honest and detailed in your descriptions. Mention the condition, size, and any unique features of the product to build trust with potential buyers.",
            "Responding to messages quickly also boosts your ranking in our search results. Happy selling!"
          ]
        }
      ]
    }
  },

  computed: {
    filteredPosts() {
      if (this.activeCategory === 'All') return this.posts;
      return this.posts.filter(post => post.category === this.activeCategory);
    }
  }
}
</script>


<style scoped>

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.blog-page {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

/* Hero Section */
.blog-hero {
  padding: 100px 20px;
  text-align: center;
  color: white;
  background-image:
      radial-gradient(circle, rgba(255, 255, 255, 0.15) 10%, transparent 10%),
      radial-gradient(circle, rgba(255, 255, 255, 0.1) 15%, transparent 15%),
      linear-gradient(250deg, #e66e00 10%, #ff7b00 100%);
  background-size: 80px 80px, 150px 150px, 100% 100%;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}

.blog-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
}

/* Category Tabs */
.filter-section {
  padding: 40px 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.categories-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 24px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #ff7b00;
  color: white;
  border-color: #ff7b00;
}

/* Blog Grid */
.blog-content {
  padding: 80px 0;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
}

.blog-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.blog-card:hover {
  transform: translateY(-10px);
}

.card-image {
  position: relative;
  height: 220px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #ff7b00;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.card-body {
  padding: 30px;
}

.post-meta {
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.card-body h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 15px;
  line-height: 1.3;
}

.card-body p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 25px;
}

.post-full-content p {
  color: #475569;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 15px;
}

.post-title {
  font-size: 1.6rem;
  color: #1e293b;
  margin-bottom: 15px;
  line-height: 1.3;
  font-weight: 700;
}

.blog-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1;
}

/* Newsletter Section */
.newsletter-section {
  padding-bottom: 100px;
}

.newsletter-card {
  background: #1e293b;
  color: white;
  padding: 60px;
  border-radius: 24px;
  text-align: center;
}

.subscribe-form {
  display: flex;
  max-width: 500px;
  margin: 30px auto 0;
  gap: 10px;
}

.subscribe-form input {
  flex: 1;
  padding: 15px 20px;
  border-radius: 12px;
  border: none;
}

.btn-dark {
  background: #ff7b00;
  color: white;
  border-radius: 12px;
  padding: 0 30px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
  .subscribe-form {
    flex-direction: column;
  }
}
</style>